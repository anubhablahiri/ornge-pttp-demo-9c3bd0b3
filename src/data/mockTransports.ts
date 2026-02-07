export type TransportMode = 'air' | 'land';
export type CareLevel = 'Critical Care' | 'Advanced Care' | 'Basic Care';

export interface TransportStatus {
  id: number;
  label: string;
  message: string;
  completedAt?: string;
  isActive?: boolean;
}

export interface CrewInfo {
  type: string;
  vehicleId: string;
  equipment: string[];
}

export interface Notification {
  id: string;
  type: 'status' | 'departure' | 'arrival' | 'delay';
  message: string;
  timestamp: string;
}

export interface Transport {
  id: string;
  referenceId: string;
  patientFirstName: string;
  lastName: string;
  careLevel: CareLevel;
  mode: TransportMode;
  originFacility: string;
  destinationFacility: string;
  originCoords: { lat: number; lng: number };
  destinationCoords: { lat: number; lng: number };
  currentPosition?: { lat: number; lng: number };
  altitude?: number;
  statuses: TransportStatus[];
  crew: CrewInfo;
  notifications: Notification[];
  etaPickup?: string;
  etaDestination?: string;
  clinicalNotes?: string;
}

export const TRANSPORT_MILESTONES = [
  { id: 0, label: 'Preparing for Transport', message: 'Our team is preparing for transport.' },
  { id: 1, label: 'Transport Team Assigned', message: 'A specialized crew has been assigned to this transport.' },
  { id: 2, label: 'Team Dispatched', message: 'The transport team has been dispatched.' },
  { id: 3, label: 'En Route to Pickup Location', message: 'The team is on the way to your family member.' },
  { id: 4, label: 'Arrived at Pickup Location', message: 'Our team has arrived at the facility.' },
  { id: 5, label: 'Patient Transfer in Progress', message: 'Our crew is with your family member now, ensuring a safe transfer.' },
  { id: 6, label: 'Departed from Pickup', message: 'Your family member is now in our care and the transport has begun.' },
  { id: 7, label: 'En Route to Destination', message: 'Transport to the destination facility is in progress. Our team is focused on safe and timely transport.' },
  { id: 8, label: 'Arrived at Destination', message: 'Arrival at the destination facility has been confirmed.' },
  { id: 9, label: 'Transport Completed', message: 'The transport has been completed successfully. Your family member has been transferred to the care team.' },
];

export const mockTransports: Transport[] = [
  {
    id: 'T-1',
    referenceId: 'ORN-2025-4821',
    patientFirstName: 'Sarah',
    lastName: 'Mitchell',
    careLevel: 'Critical Care',
    mode: 'air',
    originFacility: 'Thunder Bay Regional Health Sciences Centre',
    destinationFacility: 'Toronto General Hospital',
    originCoords: { lat: 48.38, lng: -89.25 },
    destinationCoords: { lat: 43.66, lng: -79.39 },
    currentPosition: { lat: 46.1, lng: -83.5 },
    altitude: 24000,
    statuses: TRANSPORT_MILESTONES.map((m, i) => ({
      ...m,
      completedAt: i <= 6 ? new Date(Date.now() - (6 - i) * 15 * 60000).toISOString() : undefined,
      isActive: i === 7,
    })),
    crew: {
      type: 'Critical Care Paramedic + Flight Nurse',
      vehicleId: 'Ornge Pilatus PC-12 (C-GORN)',
      equipment: ['Ventilator', 'Cardiac Monitor', 'IV Pumps', 'Blood Products'],
    },
    notifications: [
      { id: 'n1', type: 'status', message: 'Transport team has been assigned.', timestamp: new Date(Date.now() - 90 * 60000).toISOString() },
      { id: 'n2', type: 'departure', message: 'Aircraft has departed from Thunder Bay.', timestamp: new Date(Date.now() - 45 * 60000).toISOString() },
      { id: 'n3', type: 'status', message: 'Currently en route to Toronto General Hospital.', timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
    ],
    etaDestination: '47 min',
    clinicalNotes: 'Patient is stable and being monitored continuously. All vital signs within expected parameters.',
  },
  {
    id: 'T-2',
    referenceId: 'ORN-2025-4819',
    patientFirstName: 'James',
    lastName: 'Chen',
    careLevel: 'Advanced Care',
    mode: 'land',
    originFacility: 'Brampton Civic Hospital',
    destinationFacility: 'Hamilton General Hospital',
    originCoords: { lat: 43.73, lng: -79.76 },
    destinationCoords: { lat: 43.26, lng: -79.87 },
    statuses: TRANSPORT_MILESTONES.map((m, i) => ({
      ...m,
      completedAt: i <= 1 ? new Date(Date.now() - (1 - i) * 10 * 60000).toISOString() : undefined,
      isActive: i === 2,
    })),
    crew: {
      type: 'Advanced Care Paramedic',
      vehicleId: 'Unit L-4417',
      equipment: ['Cardiac Monitor', 'IV Pumps', 'Suction Unit'],
    },
    notifications: [
      { id: 'n1', type: 'status', message: 'Transport request received and being processed.', timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
      { id: 'n2', type: 'status', message: 'A specialized crew has been assigned.', timestamp: new Date(Date.now() - 10 * 60000).toISOString() },
    ],
    etaPickup: '22 min',
    clinicalNotes: 'Awaiting team dispatch. Patient status reported stable by originating facility.',
  },
  {
    id: 'T-3',
    referenceId: 'ORN-2025-4815',
    patientFirstName: 'Maria',
    lastName: 'Santos',
    careLevel: 'Critical Care',
    mode: 'air',
    originFacility: 'Sudbury Health Sciences North',
    destinationFacility: 'The Ottawa Hospital',
    originCoords: { lat: 46.49, lng: -81.0 },
    destinationCoords: { lat: 45.4, lng: -75.69 },
    statuses: TRANSPORT_MILESTONES.map((m, i) => ({
      ...m,
      completedAt: new Date(Date.now() - (9 - i) * 20 * 60000).toISOString(),
      isActive: false,
    })),
    crew: {
      type: 'Critical Care Paramedic + Flight Nurse',
      vehicleId: 'Ornge AW139 (C-GORG)',
      equipment: ['Ventilator', 'Cardiac Monitor', 'IV Pumps', 'Isolette'],
    },
    notifications: [
      { id: 'n1', type: 'departure', message: 'Aircraft departed from Sudbury.', timestamp: new Date(Date.now() - 150 * 60000).toISOString() },
      { id: 'n2', type: 'arrival', message: 'Arrived at The Ottawa Hospital. Transport completed.', timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
    ],
    clinicalNotes: 'Transport completed successfully. Patient transferred to receiving team.',
  },
];

export function getTransportByRef(refId: string, lastName: string): Transport | undefined {
  return mockTransports.find(
    (t) => t.referenceId.toLowerCase() === refId.toLowerCase() && t.lastName.toLowerCase() === lastName.toLowerCase()
  );
}

export function getCurrentStatusIndex(transport: Transport): number {
  const active = transport.statuses.findIndex((s) => s.isActive);
  if (active >= 0) return active;
  const lastCompleted = [...transport.statuses].reverse().findIndex((s) => s.completedAt);
  return lastCompleted >= 0 ? transport.statuses.length - 1 - lastCompleted : -1;
}

export function isTransportComplete(transport: Transport): boolean {
  return transport.statuses.every((s) => s.completedAt);
}
