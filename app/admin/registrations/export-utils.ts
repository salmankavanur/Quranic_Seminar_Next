import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Registration } from '@/types/registration';

// Helper function to convert registrations to CSV format
export const exportToCSV = (registrations: Registration[]) => {
  // Define CSV headers
  const headers = [
    'First Name',
    'Last Name',
    'Email',
    'Institution',
    'Participant Type',
    'Status',
    'Created At'
  ].join(',');

  // Convert registrations to CSV rows
  const rows = registrations.map(reg => [
    reg.first_name,
    reg.last_name,
    reg.email,
    reg.institution,
    reg.participant_type,
    reg.status,
    new Date(reg.created_at).toLocaleDateString()
  ].map(field => `"${field}"`).join(','));

  // Combine headers and rows
  const csv = [headers, ...rows].join('\n');

  // Create and trigger download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `registrations-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Helper function to export registrations to PDF
export const exportToPDF = (registrations: Registration[]) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text('Registrations Report', 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 22);

  // Define table columns
  const columns = [
    'Name',
    'Email',
    'Institution',
    'Type',
    'Status',
    'Created'
  ];

  // Prepare table data
  const data = registrations.map(reg => [
    `${reg.first_name} ${reg.last_name}`,
    reg.email,
    reg.institution,
    reg.participant_type,
    reg.status,
    new Date(reg.created_at).toLocaleDateString()
  ]);

  // Add table using autoTable
  autoTable(doc, {
    head: [columns],
    body: data,
    startY: 30,
    margin: { top: 25 },
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  // Save the PDF
  doc.save(`registrations-${new Date().toISOString().split('T')[0]}.pdf`);
}; 