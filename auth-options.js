import CredentialsProvider from "next-auth/providers/credentials";

// Mock user data for demonstration purposes
// In production, these would be stored in a database
export const mockUsers = [
  {
    id: "1",
    name: "Client Demo",
    email: "client@example.com",
    password: "client123",
    image: "/avatars/client.png",
    role: "client",
    specialties: [],
    profile: {
      bio: "A client looking for professional expertise in various fields.",
      phone: "+1234567890",
      address: "123 Client Street, City, Country",
      preferences: {
        notifications: true,
        emailAlerts: true,
      }
    }
  },
  {
    id: "2",
    name: "Expert Demo",
    email: "expert@example.com",
    password: "expert123",
    image: "/avatars/expert.png",
    role: "expert",
    specialties: ["Cardiology", "Health"],
    profile: {
      bio: "Experienced medical professional specializing in cardiovascular health.",
      phone: "+1987654321",
      address: "456 Expert Avenue, City, Country",
      education: [
        {
          degree: "MD, Cardiology",
          institution: "Medical University",
          year: "2010"
        }
      ],
      experience: [
        {
          position: "Cardiologist",
          company: "General Hospital",
          years: "2010-Present"
        }
      ],
      hourlyRate: 150,
      availability: [
        { day: "Monday", start: "09:00", end: "17:00" },
        { day: "Wednesday", start: "09:00", end: "17:00" },
        { day: "Friday", start: "09:00", end: "17:00" }
      ],
      verified: true,
      verificationDate: "2023-01-15"
    }
  },
  {
    id: "3",
    name: "Admin Demo",
    email: "admin@example.com",
    password: "admin123",
    image: "/avatars/admin.png",
    role: "admin",
    specialties: [],
    profile: {
      bio: "System administrator responsible for platform management.",
      phone: "+1555555555",
      adminLevel: "Super Admin",
      department: "Platform Operations"
    }
  },
  {
    id: "4",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    password: "sarah123",
    image: "/avatars/sarah.png",
    role: "expert",
    specialties: ["Mental Health", "Anxiety Management"],
    profile: {
      bio: "Licensed psychologist with 12 years of experience in anxiety and stress management.",
      phone: "+1777777777",
      address: "789 Mental Health Blvd, City, Country",
      education: [
        {
          degree: "PhD, Clinical Psychology",
          institution: "Psychology University",
          year: "2011"
        }
      ],
      experience: [
        {
          position: "Clinical Psychologist",
          company: "Mental Wellness Center",
          years: "2011-Present"
        }
      ],
      hourlyRate: 120,
      availability: [
        { day: "Tuesday", start: "10:00", end: "18:00" },
        { day: "Thursday", start: "10:00", end: "18:00" },
        { day: "Saturday", start: "10:00", end: "15:00" }
      ],
      verified: true,
      verificationDate: "2023-02-20"
    }
  },
  {
    id: "5",
    name: "Dr. Michael Chen",
    email: "michael.chen@example.com",
    password: "michael123",
    image: "/avatars/michael.png",
    role: "expert",
    specialties: ["Nutrition", "Weight Management"],
    profile: {
      bio: "Registered dietitian and nutritionist with expertise in weight management and healthy eating habits.",
      phone: "+1888888888",
      address: "101 Nutrition Road, City, Country",
      education: [
        {
          degree: "MSc, Nutrition Science",
          institution: "Health Sciences University",
          year: "2009"
        }
      ],
      experience: [
        {
          position: "Senior Nutritionist",
          company: "Diet & Wellness Clinic",
          years: "2009-Present"
        }
      ],
      hourlyRate: 100,
      availability: [
        { day: "Monday", start: "08:00", end: "16:00" },
        { day: "Tuesday", start: "08:00", end: "16:00" },
        { day: "Wednesday", start: "08:00", end: "16:00" },
        { day: "Thursday", start: "08:00", end: "16:00" },
        { day: "Friday", start: "08:00", end: "16:00" }
      ],
      verified: true,
      verificationDate: "2023-03-10"
    }
  },
  {
    id: "6",
    name: "Dr. Emma Williams",
    email: "emma.williams@example.com",
    password: "emma123",
    image: "/avatars/emma.png",
    role: "expert",
    specialties: ["Dermatology"],
    profile: {
      bio: "Board-certified dermatologist specializing in skin conditions, treatments, and preventive care.",
      phone: "+1999999999",
      address: "202 Dermatology Court, City, Country",
      education: [
        {
          degree: "MD, Dermatology",
          institution: "Medical College",
          year: "2008"
        }
      ],
      experience: [
        {
          position: "Dermatologist",
          company: "Skin Health Center",
          years: "2008-Present"
        }
      ],
      hourlyRate: 180,
      availability: [
        { day: "Monday", start: "09:00", end: "17:00" },
        { day: "Wednesday", start: "09:00", end: "17:00" },
        { day: "Friday", start: "09:00", end: "17:00" }
      ],
      verified: false,
      verificationDocuments: [
        {
          type: "Medical License",
          status: "Pending Review",
          submittedDate: "2023-06-01"
        },
        {
          type: "Board Certification",
          status: "Pending Review",
          submittedDate: "2023-06-01"
        }
      ]
    }
  },
  {
    id: "7",
    name: "Dr. James Rodriguez",
    email: "james.rodriguez@example.com",
    password: "james123",
    image: "/avatars/james.png",
    role: "expert",
    specialties: ["Pain Management", "Physical Therapy"],
    profile: {
      bio: "Physical therapist with extensive experience in pain management and rehabilitation.",
      phone: "+1222222222",
      address: "303 Therapy Lane, City, Country",
      education: [
        {
          degree: "DPT, Physical Therapy",
          institution: "Rehabilitation Institute",
          year: "2012"
        }
      ],
      experience: [
        {
          position: "Lead Physical Therapist",
          company: "Pain Management & Rehab Center",
          years: "2012-Present"
        }
      ],
      hourlyRate: 110,
      availability: [
        { day: "Tuesday", start: "08:00", end: "18:00" },
        { day: "Thursday", start: "08:00", end: "18:00" },
        { day: "Saturday", start: "09:00", end: "14:00" }
      ],
      verified: false,
      verificationDocuments: [
        {
          type: "Professional License",
          status: "Pending Review",
          submittedDate: "2023-07-15"
        }
      ]
    }
  }
];

// Mock appointments data
export const mockAppointments = [
  {
    id: "a1",
    clientId: "1",
    expertId: "2",
    date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    startTime: "10:00",
    endTime: "11:00",
    status: "confirmed",
    subject: "Heart health consultation",
    notes: "Initial consultation to discuss heart health concerns",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString() // 3 days ago
  },
  {
    id: "a2",
    clientId: "1",
    expertId: "4",
    date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    startTime: "14:00",
    endTime: "15:00",
    status: "confirmed",
    subject: "Anxiety management session",
    notes: "Follow-up session to discuss progress with anxiety management techniques",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
  },
  {
    id: "a3",
    clientId: "1",
    expertId: "5",
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    startTime: "09:00",
    endTime: "10:00",
    status: "completed",
    subject: "Nutrition consultation",
    notes: "Diet plan review and adjustments",
    feedback: {
      rating: 5,
      comment: "Dr. Chen provided excellent advice and a customized diet plan."
    },
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString() // 10 days ago
  }
];

// Mock verification requests data
export const mockVerificationRequests = [
  {
    id: "v1",
    expertId: "6",
    submittedDate: "2023-06-01",
    status: "pending",
    documents: [
      {
        type: "Medical License",
        fileUrl: "/documents/emma-license.pdf",
        status: "pending"
      },
      {
        type: "Board Certification",
        fileUrl: "/documents/emma-certification.pdf",
        status: "pending"
      }
    ],
    reviewerNotes: "",
    assignedTo: "3" // admin ID
  },
  {
    id: "v2",
    expertId: "7",
    submittedDate: "2023-07-15",
    status: "pending",
    documents: [
      {
        type: "Professional License",
        fileUrl: "/documents/james-license.pdf",
        status: "pending"
      }
    ],
    reviewerNotes: "",
    assignedTo: "3" // admin ID
  }
];

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user in mock data
        const user = mockUsers.find(user => user.email === credentials.email);

        if (!user || user.password !== credentials.password) {
          return null;
        }

        // Return only necessary user data (exclude password)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          specialties: user.specialties
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.specialties = user.specialties;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.specialties = token.specialties;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "NEXT_AUTH_SECRET_YET_TO_BE_SET",
};

// Helper functions to work with mock data
export function getUserById(id) {
  return mockUsers.find(user => user.id === id);
}

export function getExpertsBySpecialty(specialty) {
  if (!specialty) {
    return mockUsers.filter(user => user.role === "expert");
  }

  return mockUsers.filter(
    user => user.role === "expert" &&
    user.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
  );
}

export function searchExperts(query) {
  if (!query) return [];
  query = query.toLowerCase();

  return mockUsers.filter(user => {
    if (user.role !== "expert") return false;

    // Search by name, email or specialties
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.specialties.some(s => s.toLowerCase().includes(query))
    );
  });
}

export function getAppointmentsByUser(userId, role) {
  if (role === "client") {
    return mockAppointments.filter(appt => appt.clientId === userId);
  } else if (role === "expert") {
    return mockAppointments.filter(appt => appt.expertId === userId);
  }
  return [];
}

export function getVerificationRequests(status = null) {
  if (status) {
    return mockVerificationRequests.filter(req => req.status === status);
  }
  return mockVerificationRequests;
}

export function getVerificationRequestById(id) {
  return mockVerificationRequests.find(req => req.id === id);
}

export function getVerificationRequestByExpertId(expertId) {
  return mockVerificationRequests.find(req => req.expertId === expertId);
}

export function updateUserProfile(userId, profileData) {
  const userIndex = mockUsers.findIndex(user => user.id === userId);
  if (userIndex === -1) return null;

  // Update user profile
  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...profileData,
    profile: {
      ...mockUsers[userIndex].profile,
      ...profileData.profile
    }
  };

  return mockUsers[userIndex];
}

export function createAppointment(appointmentData) {
  const newAppointment = {
    id: `a${mockAppointments.length + 1}`,
    createdAt: new Date().toISOString(),
    status: "pending",
    ...appointmentData
  };

  mockAppointments.push(newAppointment);
  return newAppointment;
}

export function updateAppointment(appointmentId, appointmentData) {
  const appointmentIndex = mockAppointments.findIndex(appt => appt.id === appointmentId);
  if (appointmentIndex === -1) return null;

  mockAppointments[appointmentIndex] = {
    ...mockAppointments[appointmentIndex],
    ...appointmentData
  };

  return mockAppointments[appointmentIndex];
}

export function updateVerificationRequest(requestId, requestData) {
  const requestIndex = mockVerificationRequests.findIndex(req => req.id === requestId);
  if (requestIndex === -1) return null;

  mockVerificationRequests[requestIndex] = {
    ...mockVerificationRequests[requestIndex],
    ...requestData
  };

  return mockVerificationRequests[requestIndex];
}
