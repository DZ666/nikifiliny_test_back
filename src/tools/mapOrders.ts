import { Order } from 'retail_api/types'

export function mapNested<O>(obj): O | O[] | Record<string, any> {
  const newObj = {}
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) newObj[key] = obj[key]
    else newObj[key] = ''

    if (typeof newObj[key] === 'object' && !Array.isArray(newObj[key])) {
      newObj[key] = mapNested(newObj[key])
    } else if (Array.isArray(newObj[key])) {
      newObj[key] = newObj[key].map((item) => mapNested(item))
    }
  })
  return newObj
}

const returnProperties = (properties = []) => {
  const newProperties = []
  if (Array.isArray(properties))
    properties.forEach((property) => {
      newProperties.push({
        code: property.code,
        name: property.name,
        value: property.value,
      })
    })
  else
    Object.entries(properties).forEach(
      ([key, entry]: [string, { name: string; value: string }]) => {
        newProperties.push({
          key,
          code: key,
          name: entry.name,
          value: entry.value,
        })
      },
    )

  return newProperties
}

// Момент с properties сделал как понял, у меня нет тз для того чтобы полностью понять что там должно быть
export function prepareOrder(order) {
  const {
      id,
      number,
      createdAt,
      status,
      statusComment,
      customerComment,
      delivery,
      items,
      site,
      orderType,
    } = order,
    newOrder = {
      id,
      number,
      createdAt,
      status,
      statusComment,
      customerComment,
      delivery: { code: delivery.code },
      items: items.map((item) => {
        const { id, status, quantity, properties, offer, comment } = item
        return {
          id,
          status,
          quantity,
          properties: returnProperties(properties),
          offer: {
            externalId: offer.externalId,
            displayName: offer.displayName,
            article: offer.article,
            properties: returnProperties(offer.properties),
          },
          comment,
        }
      }),
      site,
      orderType,
    }

  return mapNested<Order>(newOrder)
}

function mapOrders<I extends unknown, O extends unknown>(orderList: I): O {
  return Array.isArray(orderList)
    ? (orderList.map((order) => prepareOrder(order)) as O)
    : (prepareOrder(orderList) as O)
}

export default mapOrders
