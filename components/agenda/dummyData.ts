import { AgendaEvent, Resource } from './Agenda';

// Hardcoded dates to avoid hydration errors
// Using a fixed date (June 15, 2024) as our reference point
const BASE_YEAR = 2025;
const BASE_MONTH = 2; // June
const BASE_DAY = 28;

// Helper function to create a date with a specific time
const createDate = (dayOffset: number, hours: number, minutes: number): Date => {
  return new Date(BASE_YEAR, BASE_MONTH - 1, BASE_DAY + dayOffset, hours, minutes, 0, 0);
};

// Dummy events data
export const dummyEvents: AgendaEvent[] = [
  {
    id: '1',
    title: 'Haircut Appointment',
    start: createDate(0, 9, 0),
    end: createDate(0, 10, 0),
    description: 'Regular haircut with John',
    color: '#3b82f6',
    resourceId: 'barber-1'
  },
  {
    id: '2',
    title: 'Beard Trim',
    start: createDate(0, 11, 30),
    end: createDate(0, 12, 15),
    description: 'Beard trim and styling',
    color: '#10b981',
    resourceId: 'barber-2'
  },
  {
    id: '3',
    title: 'Hair Coloring',
    start: createDate(0, 14, 0),
    end: createDate(0, 16, 0),
    description: 'Full hair coloring service',
    color: '#f59e0b',
    resourceId: 'barber-3'
  },
  {
    id: '4',
    title: 'Shave Service',
    start: createDate(1, 10, 0),
    end: createDate(1, 11, 0),
    description: 'Premium shave service',
    color: '#ec4899',
    resourceId: 'barber-1'
  },
  {
    id: '5',
    title: 'Hair Treatment',
    start: createDate(1, 13, 0),
    end: createDate(1, 14, 30),
    description: 'Scalp treatment and hair mask',
    color: '#8b5cf6',
    resourceId: 'barber-2'
  },
  {
    id: '6',
    title: "Kid's Haircut",
    start: createDate(2, 9, 30),
    end: createDate(2, 10, 15),
    description: "Children's haircut (age 10)",
    color: '#06b6d4',
    resourceId: 'barber-3'
  },
  {
    id: '7',
    title: 'Styling Session',
    start: createDate(2, 16, 0),
    end: createDate(2, 17, 0),
    description: 'Hair styling for event',
    color: '#f43f5e',
    resourceId: 'barber-1'
  },
  {
    id: '8',
    title: 'Consultation',
    start: createDate(-1, 11, 0),
    end: createDate(-1, 11, 30),
    description: 'New client consultation',
    color: '#84cc16',
    resourceId: 'barber-2'
  },
  {
    id: '9',
    title: 'Beard Grooming Class',
    start: createDate(-1, 15, 0),
    end: createDate(-1, 16, 30),
    description: 'Group class on beard maintenance',
    color: '#6366f1',
    resourceId: 'barber-3'
  }
];

// Dummy resources data
export const dummyResources: Resource[] = [
  {
    id: 'barber-1',
    name: 'John Smith',
    type: 'Barber',
    color: '#3b82f6',
    avatar: '/avatars/john.png'
  },
  {
    id: 'barber-2',
    name: 'Sarah Johnson',
    type: 'Hair Stylist',
    color: '#10b981',
    avatar: '/avatars/sarah.png'
  },
  {
    id: 'barber-3',
    name: 'Mike Chen',
    type: 'Colorist',
    color: '#f59e0b',
    avatar: '/avatars/mike.png'
  }
]; 