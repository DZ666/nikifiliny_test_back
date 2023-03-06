import { Injectable } from '@nestjs/common'
import axios, { AxiosInstance } from 'axios'
import { plainToClass } from 'class-transformer'
import { OrdersResponse } from 'graphql'
import getDeliveryCode, { DeliveryCode } from 'tools/getDeliveries'
import getStatus, { Statuses } from 'tools/getStatuses'
import mapOrders from 'tools/mapOrders'
import { serialize } from '../tools'
import { CrmType, Order, OrdersFilter, RetailPagination } from './types'

@Injectable()
export class RetailService {
  private readonly axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: `${process.env.RETAIL_URL}/api/v5`,
      timeout: 10000,
      headers: {},
    })

    this.axios.interceptors.request.use((config) => {
      // console.log(config.url)
      config.params = {
        ...config.params,
        apiKey: process.env.RETAIL_KEY,
      }
      return config
    })
    this.axios.interceptors.response.use(
      (r) => {
        // console.log("Result:", r.data)
        return r
      },
      (r) => {
        // console.log("Error:", r.response.data)
        return r
      },
    )
  }

  async orders(filter?: OrdersFilter): Promise<[Order[], RetailPagination]> {
    const params = serialize(filter, '')
    const resp = await this.axios.get('/orders?' + params)

    if (!resp.data) throw new Error('RETAIL CRM ERROR')

    const orders = plainToClass(Order, resp.data.orders as Array<any>)
    const pagination: RetailPagination = resp.data.pagination

    return [orders, pagination]
  }

  async findOrderList(page: number): Promise<OrdersResponse> {
    return this.orders({ page }).then(([orders, pagination]) => {
      return {
        orders: mapOrders<any, Order[]>(orders),
        pagination,
      }
    }) as unknown as OrdersResponse
  }

  async findOrder(id: string): Promise<Order | null> {
    return this.orders({ filter: { numbers: [id] } }).then(([orders]) => {
      if (!orders.length) return null

      return mapOrders<any, Order>(orders[0])
    })
  }

  async orderStatuses(): Promise<CrmType[]> {
    const statuses = Object.entries(Statuses)
    const statusesCodes = statuses.map(([key]) => {
      return getStatus(key)
    })
    return statusesCodes
  }

  async productStatuses(): Promise<CrmType[]> {
    const statuses = Object.entries(Statuses)
    const statusesCodes = statuses.map(([key]) => {
      return getStatus(key)
    })
    return statusesCodes
  }

  async deliveryTypes(): Promise<CrmType[]> {
    const deliveryCodes = Object.entries(DeliveryCode)
    const deliveryTypes = deliveryCodes.map(([key]) => {
      return getDeliveryCode(key)
    })
    return deliveryTypes
  }
}
