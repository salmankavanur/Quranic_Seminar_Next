export interface Registration {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  institution: string;
  participant_type: 'Presenter' | 'Student' | 'Attendee';
  status: 'pending' | 'confirmed' | 'rejected';
  created_at: string;
  updated_at: string | null;
} 