export enum Statuses {
  'prepayed' = 'Предоплата',
  'sold' = 'Продан',
  'delivered' = 'Доставлен',
  'paid' = 'Оплачен',
  'not-paid' = 'Не оплачен',
  'assembling' = 'Сборка',
  'complete' = 'Завершен',
  'redirect' = 'Перенаправлен',
  'send-to-delivery' = 'Отправлен в доставку',
  'delivering' = 'Доставка',
  'product-is-damaged' = 'Товар поврежден',
  'returned' = 'Возврат',
  'delyvery-did-not-suit' = 'Доставка не подошла',
  'assembly-delivery' = 'Сборка и доставка',
  'fail' = 'Неудача',
  'partially-completed' = 'Частично завершен',
  'confirming' = 'Подтверждение',
  'out-of-stock' = 'Нет в наличии',
  'new' = 'Новый',
  'lost' = 'Потерян',
  'canceled' = 'Отменен',
  'no-call' = 'Не звонить',
  'in-reserve' = 'В резерве',
  'wait-approved' = 'Ожидает подтверждения',
  'return' = 'Возврат',
  'cancel-other' = 'Отменен другим',
  'prices-did-not-suit' = 'Цены не подошли',
  'already-buyed' = 'Уже куплен',
}

export default function getStatus(statusCode: string) {
  return {
    code: statusCode,
    name: Statuses[statusCode as keyof typeof Statuses] || statusCode,
  }
}
