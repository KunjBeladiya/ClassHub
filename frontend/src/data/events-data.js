// Mock data and utility functions for events

export async function getEvents({ search = "", category = "", type = "", date = "" } = {}) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  let events = mockEvents

  // Apply filters
  if (search) {
    const searchLower = search.toLowerCase()
    events = events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.organizer.full_name.toLowerCase().includes(searchLower),
    )
  }

  if (category) {
    events = events.filter((event) => event.category === category)
  }

  if (type) {
    if (type === "virtual") {
      events = events.filter((event) => event.is_virtual)
    } else if (type === "in-person") {
      events = events.filter((event) => !event.is_virtual)
    }
  }

  if (date) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    const thisWeekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    const nextWeekEnd = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)
    const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    events = events.filter((event) => {
      const eventDate = new Date(event.date)

      switch (date) {
        case "today":
          return eventDate >= today && eventDate < tomorrow
        case "tomorrow":
          return eventDate >= tomorrow && eventDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
        case "this-week":
          return eventDate >= today && eventDate <= thisWeekEnd
        case "next-week":
          return eventDate > thisWeekEnd && eventDate <= nextWeekEnd
        case "this-month":
          return eventDate >= today && eventDate <= thisMonthEnd
        default:
          return true
      }
    })
  }

  // Sort by date (upcoming first)
  events.sort((a, b) => new Date(a.date) - new Date(b.date))

  return events
}

export async function getEventById(id) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const event = mockEvents.find((event) => event.id === id)
  return event || null
}

// Mock events data
const mockEvents = [
  {
    id: "event-1",
    title: "AI Workshop: Introduction to Machine Learning",
    description:
      "Join us for an exciting introduction to machine learning! This hands-on workshop will cover the fundamentals of AI and ML, including supervised learning, neural networks, and practical applications. Perfect for beginners and those looking to expand their knowledge.\n\nWhat you'll learn:\n- Basic concepts of machine learning\n- Popular algorithms and their applications\n- Hands-on coding exercises\n- Real-world case studies\n\nBring your laptop and get ready to dive into the world of AI!",
    date: "2024-02-15T18:00:00Z",
    location: "Computer Science Building, Room 101",
    category: "Workshop",
    image_url: "/placeholder.svg?height=300&width=500",
    is_virtual: false,
    max_attendees: 50,
    organizer_id: "user-1",
    created_at: "2024-01-20T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z",
    organizer: {
      id: "user-1",
      full_name: "Alex Johnson",
      email: "alex.johnson@university.edu",
      university: "Stanford University",
      major: "Computer Science",
      avatar_url: "/placeholder.svg?height=40&width=40",
    },
    attendees: [
      {
        user: {
          id: "user-2",
          full_name: "Sarah Chen",
          major: "Data Science",
          avatar_url: "/placeholder.svg?height=32&width=32",
        },
      },
      {
        user: {
          id: "user-3",
          full_name: "Mike Rodriguez",
          major: "Computer Engineering",
          avatar_url: "/placeholder.svg?height=32&width=32",
        },
      },
    ],
  },
  {
    id: "event-2",
    title: "Coding Bootcamp: React Fundamentals",
    description:
      "Master the fundamentals of React in this intensive bootcamp! Whether you're new to React or looking to solidify your understanding, this session will cover everything you need to know to build modern web applications.\n\nTopics covered:\n- React components and JSX\n- State management with hooks\n- Event handling and forms\n- Building a complete project\n\nPrerequisites: Basic JavaScript knowledge",
    date: "2024-03-01T14:00:00Z",
    location: "https://zoom.us/j/123456789",
    category: "Bootcamp",
    image_url: "/placeholder.svg?height=300&width=500",
    is_virtual: true,
    max_attendees: 100,
    organizer_id: "user-4",
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
    organizer: {
      id: "user-4",
      full_name: "Emily Davis",
      email: "emily.davis@university.edu",
      university: "MIT",
      major: "Software Engineering",
      avatar_url: "/placeholder.svg?height=40&width=40",
    },
    attendees: [
      {
        user: {
          id: "user-5",
          full_name: "David Kim",
          major: "Web Development",
          avatar_url: "/placeholder.svg?height=32&width=32",
        },
      },
    ],
  },
  {
    id: "event-3",
    title: "Tech Career Fair Prep Session",
    description:
      "Get ready for the upcoming tech career fair with this comprehensive preparation session! We'll cover everything from resume optimization to interview techniques specifically for tech roles.\n\nWhat we'll cover:\n- Resume writing for tech positions\n- Common technical interview questions\n- Networking strategies\n- Company research techniques\n- Mock interview practice\n\nBring your resume for personalized feedback!",
    date: "2024-03-20T16:00:00Z",
    location: "Student Center, Hall A",
    category: "Career",
    image_url: "/placeholder.svg?height=300&width=500",
    is_virtual: false,
    max_attendees: 75,
    organizer_id: "user-1",
    created_at: "2024-02-15T00:00:00Z",
    updated_at: "2024-02-15T00:00:00Z",
    organizer: {
      id: "user-1",
      full_name: "Alex Johnson",
      email: "alex.johnson@university.edu",
      university: "Stanford University",
      major: "Computer Science",
      avatar_url: "/placeholder.svg?height=40&width=40",
    },
    attendees: [],
  },
  {
    id: "event-4",
    title: "Startup Pitch Competition",
    description:
      "Watch the next generation of entrepreneurs present their innovative ideas! Student teams will pitch their startup concepts to a panel of industry experts and investors.\n\nEvent highlights:\n- 10 student startup presentations\n- Expert panel feedback\n- Networking opportunities\n- Prize announcements\n- Refreshments provided\n\nGreat opportunity to see innovation in action and network with fellow entrepreneurs!",
    date: "2024-01-25T19:00:00Z",
    location: "Business School Auditorium",
    category: "Competition",
    image_url: "/placeholder.svg?height=300&width=500",
    is_virtual: false,
    max_attendees: 200,
    organizer_id: "user-6",
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z",
    organizer: {
      id: "user-6",
      full_name: "Jennifer Liu",
      email: "jennifer.liu@university.edu",
      university: "UC Berkeley",
      major: "Business Administration",
      avatar_url: "/placeholder.svg?height=40&width=40",
    },
    attendees: [
      {
        user: {
          id: "user-7",
          full_name: "Robert Taylor",
          major: "Entrepreneurship",
          avatar_url: "/placeholder.svg?height=32&width=32",
        },
      },
      {
        user: {
          id: "user-8",
          full_name: "Lisa Wang",
          major: "Marketing",
          avatar_url: "/placeholder.svg?height=32&width=32",
        },
      },
      {
        user: {
          id: "user-9",
          full_name: "James Brown",
          major: "Finance",
          avatar_url: "/placeholder.svg?height=32&width=32",
        },
      },
    ],
  },
  {
    id: "event-5",
    title: "Open Source Contribution Workshop",
    description:
      "Learn how to contribute to open source projects and make your mark in the developer community! This workshop is perfect for students who want to gain real-world experience and build their portfolio.\n\nWorkshop agenda:\n- Understanding open source culture\n- Finding projects to contribute to\n- Git and GitHub best practices\n- Making your first pull request\n- Building your open source profile\n\nAll skill levels welcome!",
    date: "2024-02-05T15:00:00Z",
    location: "https://meet.google.com/abc-defg-hij",
    category: "Workshop",
    image_url: "/placeholder.svg?height=300&width=500",
    is_virtual: true,
    max_attendees: null,
    organizer_id: "user-10",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
    organizer: {
      id: "user-10",
      full_name: "Kevin Zhang",
      email: "kevin.zhang@university.edu",
      university: "Carnegie Mellon",
      major: "Software Engineering",
      avatar_url: "/placeholder.svg?height=40&width=40",
    },
    attendees: [
      {
        user: {
          id: "user-11",
          full_name: "Amanda Wilson",
          major: "Computer Science",
          avatar_url: "/placeholder.svg?height=32&width=32",
        },
      },
      {
        user: {
          id: "user-12",
          full_name: "Chris Martinez",
          major: "Information Systems",
          avatar_url: "/placeholder.svg?height=32&width=32",
        },
      },
    ],
  },
  {
    id: "event-6",
    title: "Data Science Study Group",
    description:
      "Join fellow data science enthusiasts for a collaborative study session! We'll work through challenging problems, share insights, and prepare for upcoming exams together.\n\nThis week's focus:\n- Statistical analysis techniques\n- Python data manipulation with pandas\n- Machine learning model evaluation\n- Practice problems and solutions\n\nBring your questions and let's learn together!",
    date: "2024-02-28T18:30:00Z",
    location: "Library, Study Room 204",
    category: "Academic",
    image_url: "/placeholder.svg?height=300&width=500",
    is_virtual: false,
    max_attendees: 15,
    organizer_id: "user-13",
    created_at: "2024-02-20T00:00:00Z",
    updated_at: "2024-02-20T00:00:00Z",
    organizer: {
      id: "user-13",
      full_name: "Priya Patel",
      email: "priya.patel@university.edu",
      university: "Stanford University",
      major: "Data Science",
      avatar_url: "/placeholder.svg?height=40&width=40",
    },
    attendees: [
      {
        user: {
          id: "user-14",
          full_name: "Tom Anderson",
          major: "Statistics",
          avatar_url: "/placeholder.svg?height=32&width=32",
        },
      },
    ],
  },
]
