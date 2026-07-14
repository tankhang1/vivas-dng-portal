import { normalizeEvent, type EventItem } from './types';

const mockEvents: EventItem[] = [
  normalizeEvent({
    id: '1',
    category: 'hoi-nghi',
    title: 'Hội nghị tổng kết công tác năm',
    startAt: '2026-07-14T08:30',
    endAt: '2026-07-14T10:30',
    location: 'Hội trường UBND Xã Tây Hồ',
    thumbnail: [],
    shortDescription: 'Tổng kết kết quả công tác năm và triển khai nhiệm vụ trọng tâm.',
    descriptionHtml: '<p>Hội nghị tổng kết công tác năm 2026.</p>',
    status: 'published',
  }),
  normalizeEvent({
    id: '2',
    category: 'tap-huan',
    title: 'Tập huấn chuyển đổi số cho cán bộ',
    startAt: '2026-07-16T13:30',
    endAt: '2026-07-16T16:00',
    location: 'Phòng họp tầng 2',
    thumbnail: [],
    shortDescription: 'Tập huấn kỹ năng số và quy trình xử lý hồ sơ điện tử.',
    descriptionHtml: '<p>Nội dung tập huấn chuyển đổi số.</p>',
    status: 'draft',
  }),
];

let eventState: EventItem[] = mockEvents.map((item) => normalizeEvent(item));

export function getEvents() {
  return [...eventState];
}

export function getEventById(id: string) {
  return eventState.find((item) => item.id === id) ?? null;
}

export function saveEvent(event: EventItem) {
  const nextEvent = normalizeEvent({
    ...event,
    id: event.id || Date.now().toString(),
  });

  const exists = eventState.some((item) => item.id === nextEvent.id);
  eventState = exists
    ? eventState.map((item) => (item.id === nextEvent.id ? nextEvent : item))
    : [nextEvent, ...eventState];
}

export function deleteEvent(id: string) {
  eventState = eventState.filter((item) => item.id !== id);
}
