import QRCode from 'qrcode';
import { Registration, DigitalBadge } from '@/types/registration';
import { getCollection } from './db';
import { ObjectId, Document, WithId } from 'mongodb';

// Badge templates for different participant types
const BADGE_TEMPLATES = {
  Presenter: 'presenter-badge-template',
  Student: 'student-badge-template',
  Attendee: 'attendee-badge-template',
} as const;

// Generate a unique badge ID
const generateBadgeId = () => {
  return new ObjectId().toString();
};

// Generate QR code data URL
export const generateQRCode = async (data: string): Promise<string> => {
  try {
    console.log('Generating QR code for data:', data);
    const qrCode = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
    });
    console.log('QR code generated successfully');
    return qrCode;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error(`Failed to generate QR code: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Create a digital badge for a registration
export const createDigitalBadge = async (registration: Registration): Promise<DigitalBadge> => {
  try {
    console.log('Starting badge generation for registration:', registration._id);
    
    if (!registration.first_name || !registration.last_name) {
      throw new Error('Registration missing required name fields');
    }

    const badgeId = generateBadgeId();
    console.log('Generated badge ID:', badgeId);
    
    // Create QR code data with registration and badge info
    const qrData = JSON.stringify({
      bid: badgeId,
      rid: registration._id,
      name: `${registration.first_name} ${registration.last_name}`,
      type: registration.participant_type,
      ts: Date.now(),
    });

    console.log('Generating QR code with data:', qrData);
    const qrCode = await generateQRCode(qrData);
    console.log('QR code generated successfully');

    const badge: DigitalBadge = {
      _id: badgeId,
      registration_id: registration._id,
      participant_name: `${registration.first_name} ${registration.last_name}`,
      participant_type: registration.participant_type,
      qr_code: qrCode,
      badge_template: BADGE_TEMPLATES[registration.participant_type],
      issued_at: new Date().toISOString(),
      status: 'active',
      attendance_records: [],
    };

    // Save badge to database
    console.log('Saving badge to database...');
    const badgesCollection = await getCollection('badges');
    const badgeResult = await badgesCollection.insertOne({
      ...badge,
      _id: new ObjectId(badge._id)
    });
    console.log('Badge saved successfully:', badgeResult.insertedId);

    // Update registration with badge info
    console.log('Updating registration with badge info...');
    const registrationsCollection = await getCollection('registrations');
    const updateResult = await registrationsCollection.updateOne(
      { _id: new ObjectId(registration._id) },
      {
        $set: {
          badge_id: badgeId,
          qr_code: qrCode,
          badge_issued_at: badge.issued_at,
          badge_status: 'issued',
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      throw new Error('Failed to update registration with badge info');
    }
    console.log('Registration updated successfully');

    return badge;
  } catch (error) {
    console.error('Error in createDigitalBadge:', error);
    throw new Error(`Failed to create digital badge: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Verify a badge using QR code data
export const verifyBadge = async (qrData: string): Promise<{
  isValid: boolean;
  badge?: DigitalBadge;
  registration?: Registration;
  message: string;
}> => {
  try {
    console.log('Verifying badge with QR data:', qrData);
    const data = JSON.parse(qrData);
    const badgesCollection = await getCollection('badges');
    const registrationsCollection = await getCollection('registrations');

    console.log('Looking up badge:', data.bid);
    const badge = await badgesCollection.findOne({ _id: new ObjectId(data.bid) }) as WithId<DigitalBadge> | null;
    if (!badge) {
      console.log('Badge not found:', data.bid);
      return { isValid: false, message: 'Invalid badge' };
    }

    console.log('Looking up registration:', data.rid);
    const registration = await registrationsCollection.findOne({ _id: new ObjectId(data.rid) }) as WithId<Registration> | null;
    if (!registration) {
      console.log('Registration not found:', data.rid);
      return { isValid: false, message: 'Invalid registration' };
    }

    if (badge.status !== 'active') {
      console.log('Badge is not active:', data.bid);
      return { isValid: false, message: 'Badge is not active' };
    }

    console.log('Badge verified successfully');
    return {
      isValid: true,
      badge,
      registration,
      message: 'Badge verified successfully',
    };
  } catch (error) {
    console.error('Error verifying badge:', error);
    return { isValid: false, message: 'Invalid QR code data' };
  }
};

// Record attendance using badge
export const recordAttendance = async (
  badgeId: string,
  sessionId: string
): Promise<boolean> => {
  try {
    console.log('Recording attendance for badge:', badgeId, 'session:', sessionId);
    const badgesCollection = await getCollection('badges');
    
    // Check if attendance already recorded for this session
    const existingRecord = await badgesCollection.findOne({
      _id: new ObjectId(badgeId),
      'attendance_records.session_id': sessionId,
    });

    if (existingRecord) {
      console.log('Attendance already recorded for this session');
      return false; // Already checked in
    }

    // Record new attendance
    const attendanceRecord = {
      session_id: sessionId,
      check_in_time: new Date().toISOString(),
    };

    const result = await badgesCollection.updateOne(
      { _id: new ObjectId(badgeId) },
      {
        $push: { attendance_records: attendanceRecord },
        $set: { last_used: new Date().toISOString() },
      }
    );

    if (result.matchedCount === 0) {
      console.error('Badge not found when recording attendance');
      return false;
    }

    console.log('Attendance recorded successfully');
    return true;
  } catch (error) {
    console.error('Error recording attendance:', error);
    return false;
  }
}; 