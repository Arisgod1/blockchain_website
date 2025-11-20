import type { AdminOperationLog, AdminAction, AdminEntity } from '@/types/entities'

export interface AdminEventDetail<T = unknown> {
	entity: AdminEntity | 'all'
	action?: AdminAction
	payload?: T
}

const ADMIN_REFRESH_EVENT = 'admin-refresh'
const ADMIN_ENTITY_UPDATED_EVENT = 'admin-entity-updated'
const ADMIN_LOG_CREATED_EVENT = 'admin-log-created'

type EventDisposer = () => void

const isBrowser = typeof window !== 'undefined'

const subscribeEvent = <T>(eventName: string, handler: (detail: T) => void): EventDisposer => {
	if (!isBrowser) {
		return () => {}
	}

	const listener = (event: Event) => {
		handler((event as CustomEvent<T>).detail)
	}

	window.addEventListener(eventName, listener as EventListener)

	return () => {
		window.removeEventListener(eventName, listener as EventListener)
	}
}

const dispatchEvent = <T>(eventName: string, detail: T) => {
	if (!isBrowser) {
		return
	}

	window.dispatchEvent(new CustomEvent<T>(eventName, { detail }))
}

export const dispatchAdminRefresh = (detail: AdminEventDetail = { entity: 'all', action: 'refresh' }) => {
	dispatchEvent(ADMIN_REFRESH_EVENT, detail)
}

export const onAdminRefresh = (handler: (detail: AdminEventDetail) => void): EventDisposer => {
	return subscribeEvent(ADMIN_REFRESH_EVENT, handler)
}

export const dispatchAdminEntityUpdated = (detail: AdminEventDetail) => {
	dispatchEvent(ADMIN_ENTITY_UPDATED_EVENT, detail)
}

export const onAdminEntityUpdated = (handler: (detail: AdminEventDetail) => void): EventDisposer => {
	return subscribeEvent(ADMIN_ENTITY_UPDATED_EVENT, handler)
}

export const dispatchAdminLogCreated = (log: AdminOperationLog) => {
	dispatchEvent(ADMIN_LOG_CREATED_EVENT, log)
}

export const onAdminLogCreated = (handler: (log: AdminOperationLog) => void): EventDisposer => {
	return subscribeEvent(ADMIN_LOG_CREATED_EVENT, handler)
}

export const adminEvents = {
	dispatchAdminRefresh,
	onAdminRefresh,
	dispatchAdminEntityUpdated,
	onAdminEntityUpdated,
	dispatchAdminLogCreated,
	onAdminLogCreated
}

export type { AdminOperationLog }
export {
	ADMIN_REFRESH_EVENT,
	ADMIN_ENTITY_UPDATED_EVENT,
	ADMIN_LOG_CREATED_EVENT
}
