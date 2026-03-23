// Format time (e.g., "14:30" -> "2:30 PM")
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Format date
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Format occupancy status
export const formatOccupancy = (status: string, current: number, capacity: number): string => {
  const percentage = (current / capacity) * 100;
  
  if (status === 'AVAILABLE') {
    if (percentage < 50) return 'Plenty of seats';
    if (percentage < 80) return 'Limited seats';
    return 'Few seats left';
  }
  
  if (status === 'LIMITED') return 'Standing room only';
  if (status === 'FULL') return 'Full';
  
  return status;
};

// Get occupancy color
export const getOccupancyColor = (status: string, current: number, capacity: number): string => {
  const percentage = (current / capacity) * 100;
  
  if (status === 'FULL' || percentage >= 95) return '#DC3545'; // Danger
  if (status === 'LIMITED' || percentage >= 80) return '#FFC107'; // Warning
  if (percentage >= 50) return '#FF5733'; // Secondary
  return '#33FF57'; // Success
};