export enum DeliveryCode {
  'pickup' = 'Самовывоз',
  'courier' = 'Курьер',
  'post' = 'Почта',
  'ems' = 'EMS',
  'self-delivery' = 'Самовывоз',
  'russian-post' = 'Почта',
}

export default function getDeliveryCode(deliveryCode: string) {
  return {
    code: deliveryCode,
    name:
      DeliveryCode[deliveryCode as keyof typeof DeliveryCode] ||
      deliveryCode ||
      '-',
  }
}
