export interface Registration {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  institution: string;
  participant_type: 'Presenter' | 'Student' | 'Attendee';
  status: 'pending' | 'confirmed' | 'rejected';
  badge_id?: string;
  qr_code?: string;
  badge_issued_at?: string;
  badge_status: 'not_issued' | 'issued' | 'revoked';
  created_at: string;
  updated_at: string | null;
}

export interface DigitalBadge {
  _id: string;
  registration_id: string;
  participant_name: string;
  participant_type: 'Presenter' | 'Student' | 'Attendee';
  qr_code: string;
  badge_template: string;
  issued_at: string;
  status: 'active' | 'revoked';
  last_used?: string;
  attendance_records: {
    session_id: string;
    check_in_time: string;
  }[];
} 