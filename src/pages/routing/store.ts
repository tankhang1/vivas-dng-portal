import { mockRoutingRules, mockRoutedItems } from "../../shared/data/mock";

export type RoutingRule = (typeof mockRoutingRules)[number];
export type RoutedItem = (typeof mockRoutedItems)[number];

let rulesState: RoutingRule[] = [...mockRoutingRules];
let itemsState: RoutedItem[] = [...mockRoutedItems];

export function getRoutingRules() {
  return [...rulesState];
}

function formatDateTime(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function saveRoutingRule(rule: RoutingRule) {
  const exists = rulesState.some((item) => item.id === rule.id);
  const nextRule = {
    ...rule,
    id: rule.id || Date.now().toString(),
    createdAt: exists ? rule.createdAt : formatDateTime(new Date()),
  };
  rulesState = exists
    ? rulesState.map((item) => (item.id === nextRule.id ? nextRule : item))
    : [...rulesState, nextRule];
}

export function deleteRoutingRule(id: string) {
  rulesState = rulesState.filter((item) => item.id !== id);
}

export function getRoutedItems() {
  return [...itemsState];
}

export function updateRoutedItemAssignment(
  id: string,
  routedDepartment: string,
  routedStaff: string,
) {
  itemsState = itemsState.map((item) =>
    item.id === id ? { ...item, routedDepartment, routedStaff } : item,
  );
}
