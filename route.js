import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import {
  authOptions,
  getVerificationRequests,
  getVerificationRequestById,
  getVerificationRequestByExpertId,
  updateVerificationRequest,
  updateUserProfile,
  getUserById,
  mockVerificationRequests
} from '../../lib/auth-options';

// GET /api/verification - Get verification requests
export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const requestId = searchParams.get('id');
  const status = searchParams.get('status');

  // Admin can see all requests
  if (session.user.role === 'admin') {
    if (requestId) {
      // Return a specific request
      const verificationRequest = getVerificationRequestById(requestId);

      if (!verificationRequest) {
        return NextResponse.json({ error: 'Verification request not found' }, { status: 404 });
      }

      // Get expert details
      const expert = getUserById(verificationRequest.expertId);

      return NextResponse.json({
        ...verificationRequest,
        expertName: expert?.name || 'Unknown Expert',
        expertEmail: expert?.email || 'unknown@example.com'
      });
    }

    // Return all requests with optional status filter
    const requests = getVerificationRequests(status);

    // Add expert details to each request
    const enhancedRequests = requests.map(req => {
      const expert = getUserById(req.expertId);

      return {
        ...req,
        expertName: expert?.name || 'Unknown Expert',
        expertEmail: expert?.email || 'unknown@example.com'
      };
    });

    return NextResponse.json(enhancedRequests);
  }

  // Experts can see their own requests
  if (session.user.role === 'expert') {
    const request = getVerificationRequestByExpertId(session.user.id);

    if (!request) {
      return NextResponse.json([]);
    }

    return NextResponse.json([request]);
  }

  // Clients can't access verification requests
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// POST /api/verification - Create a verification request
export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'expert') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { documents } = body;

    if (!Array.isArray(documents) || documents.length === 0) {
      return NextResponse.json(
        { error: 'Documents are required' },
        { status: 400 }
      );
    }

    // Check if expert already has a verification request
    const existingRequest = getVerificationRequestByExpertId(session.user.id);

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You already have a verification request pending' },
        { status: 409 }
      );
    }

    // Create a new verification request
    const newRequestId = `v${mockVerificationRequests.length + 1}`;
    const now = new Date().toISOString();

    const newRequest = {
      id: newRequestId,
      expertId: session.user.id,
      submittedDate: now,
      status: 'pending',
      documents: documents.map(doc => ({
        ...doc,
        status: 'pending'
      })),
      reviewerNotes: '',
      assignedTo: null // Will be assigned to an admin later
    };

    mockVerificationRequests.push(newRequest);

    return NextResponse.json(newRequest);
  } catch (error) {
    console.error('Error creating verification request:', error);
    return NextResponse.json(
      { error: 'Failed to create verification request' },
      { status: 500 }
    );
  }
}

// PATCH /api/verification - Update a verification request (admin only)
export async function PATCH(request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, reviewerNotes, documentStatuses } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Request ID and status are required' },
        { status: 400 }
      );
    }

    // Find the verification request
    const verificationRequest = getVerificationRequestById(id);

    if (!verificationRequest) {
      return NextResponse.json(
        { error: 'Verification request not found' },
        { status: 404 }
      );
    }

    // Update the verification request
    const updatedRequest = updateVerificationRequest(id, {
      status,
      reviewerNotes: reviewerNotes || verificationRequest.reviewerNotes,
      assignedTo: session.user.id,
      documents: documentStatuses
        ? verificationRequest.documents.map((doc, index) => ({
            ...doc,
            status: documentStatuses[index] || doc.status
          }))
        : verificationRequest.documents
    });

    // If verification was approved, update the expert's profile
    if (status === 'approved') {
      updateUserProfile(verificationRequest.expertId, {
        profile: {
          verified: true,
          verificationDate: new Date().toISOString()
        }
      });
    } else if (status === 'rejected') {
      updateUserProfile(verificationRequest.expertId, {
        profile: {
          verified: false,
          verificationDate: null
        }
      });
    }

    // Get expert details
    const expert = getUserById(updatedRequest.expertId);

    return NextResponse.json({
      ...updatedRequest,
      expertName: expert?.name || 'Unknown Expert',
      expertEmail: expert?.email || 'unknown@example.com'
    });
  } catch (error) {
    console.error('Error updating verification request:', error);
    return NextResponse.json(
      { error: 'Failed to update verification request' },
      { status: 500 }
    );
  }
}
