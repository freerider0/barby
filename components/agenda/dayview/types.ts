import { AgendaEvent } from '../Agenda';

export interface DayViewProps {
  selectedDate: Date;
  events: AgendaEvent[];
  onEventUpdate?: (event: AgendaEvent) => void;
  onDayClick?: (time: Date) => void;
}

export interface TimeState {
  hours: number;
  minutes: number;
}

export interface HourMarker {
  hour: number;
  label: string;
} 