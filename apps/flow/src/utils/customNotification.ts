import { notification } from "antd";
import type {
  ArgsProps,
  NotificationInstance,
} from "antd/es/notification/interface";
let notificationId = 0;

function getCommonConfig(args: ArgsProps) {
  const randomKey = `notificationId${notificationId++}`;
  return {
    key: randomKey,
    placement: "bottomRight",
    ...args,
  } as ArgsProps & { key: ArgsProps["key"] };
}

export const NotificationRef = {
  current: notification as unknown as NotificationInstance,
  notificationInsList: [] as { destroy: () => void }[],
};

export function closeNotification(k: ArgsProps["key"]) {
  return NotificationRef.current?.destroy(k);
}

export function createNotification(args: ArgsProps) {
  const config = getCommonConfig(args);
  NotificationRef.notificationInsList.push({
    destroy() {
      closeNotification(config.key);
    },
  });
  return NotificationRef.current.open(config);
}

export function createSucNotification(args: ArgsProps) {
  return createNotification({
    ...args,
    type: "success",
  });
}
