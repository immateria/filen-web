import { ThemeProvider, useTheme } from "@/providers/themeProvider"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { memo, useEffect, useState, useRef, useCallback } from "react"
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, focusManager, QueryClientProvider } from "@tanstack/react-query"
import { experimental_createPersister, type PersistedQuery } from "@tanstack/query-persist-client-core"
import useIsAuthed from "@/hooks/useIsAuthed"
import queryClientPersisterIDB, { queryClientPersisterPrefix } from "@/lib/queryPersister"
import DragSelect from "@/components/dragSelect"
import DropZone from "@/components/dropZone"
import Transfers from "@/components/transfers"
import {
       ConfirmDialog,
       SelectDriveItemDialog,
       PreviewDialog,
       InputDialog,
       SelectContactsDialog,
       TransparentFullScreenImageDialog,
       TwoFactorCodeDialog,
       PublicLinkDialog,
       SharedWithDialog,
       FileVersionsDialog,
       NoteHistoryDialog,
       NoteParticipantsDialog,
       ProfileDialog,
       CreateSyncDialog,
       InfoDialog,
       IsOnlineDialog,
       DesktopUpdateDialog,
       MetadataDialog,
       StorageDialog,
       MaintenanceDialog,
       LockDialog
} from "@/components/dialogs"
import { UNCACHED_QUERY_KEYS, IS_DESKTOP } from "@/constants"
import NotificationHandler from "@/components/notificationHandler"
import ActivityHandler from "@/components/activityHandler"
import { setup as setupApp } from "@/lib/setup"
import CookieConsent from "@/components/cookieConsent"
import LogoSVG from "@/assets/logo"
import useIsMobile from "@/hooks/useIsMobile"
import DesktopHandler from "@/components/desktopHandler"
import DesktopListener from "@/components/desktopListener"
import Page404 from "@/components/404"
import RemoteConfigHandler from "@/components/remoteConfigHandler"
import ExportReminder from "@/components/exportReminder"
import memoize from "lodash/memoize"

window.disableInvalidAPIKeyLogout = false

focusManager.setEventListener(handleFocus => {
	const onFocus = () => {
		handleFocus(true)
	}

	const onBlur = () => {
		handleFocus(false)
	}

       window.addEventListener("focus", onFocus, false)
       window.addEventListener("blur", onBlur, false)

	return () => {
		window.removeEventListener("focus", onFocus)
		window.removeEventListener("blur", onBlur)
	}
})

const shouldPersistQuery = memoize(
	(queryKey: unknown[]) => {
		const shouldNotPersist = queryKey.some(queryKey => typeof queryKey === "string" && UNCACHED_QUERY_KEYS.includes(queryKey))

		return !shouldNotPersist
	},
	queryKey => queryKey.join(":")
)

export const queryClientPersister = experimental_createPersister({
	storage: queryClientPersisterIDB,
	maxAge: 86400 * 1000 * 7,
	buster: "",
	serialize: query => {
		if (query.state.status !== "success" || !shouldPersistQuery(query.queryKey as unknown[])) {
			return undefined
		}

		return query
	},
	deserialize: query => query as PersistedQuery,
	prefix: queryClientPersisterPrefix
})

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnMount: "always",
			refetchOnReconnect: "always",
			refetchOnWindowFocus: "always",
			staleTime: 86400 * 1000 * 7,
			gcTime: 86400 * 1000 * 7,
			persister: queryClientPersister
		}
	}
})

export async function restoreQueries(): Promise<void> {
	const keys = await queryClientPersisterIDB.keys()

	await Promise.all(
		keys.map(async key => {
			if (key.startsWith(queryClientPersisterPrefix)) {
				const persistedQuery = (await queryClientPersisterIDB.getItem(key)) as unknown as PersistedQuery

				if (!persistedQuery || !persistedQuery.state) {
					await queryClientPersisterIDB.removeItem(key)

					return
				}

				const shouldNotPersist = !shouldPersistQuery(persistedQuery.queryKey as unknown[])

				if (persistedQuery.state.status === "success") {
					if (!shouldNotPersist) {
						queryClient.setQueryData(persistedQuery.queryKey, persistedQuery.state.data, {
							updatedAt: persistedQuery.state.dataUpdatedAt
						})
					} else {
						await queryClientPersisterIDB.removeItem(key)
					}
				}
			}
		})
	)
}

export const Loading = memo(() => {
	const { dark } = useTheme()
	const isMobile = useIsMobile()

	return (
		<div
			className="flex flex-row w-screen h-[100dvh] items-center justify-center"
			style={{
				// @ts-expect-error not typed
				WebkitAppRegion: "drag"
			}}
		>
			<div className={isMobile ? "w-[80px] h-[80px]" : "w-[128px] h-[128px]"}>
				<LogoSVG
					color={dark ? "white" : "black"}
					pulse={true}
				/>
			</div>
		</div>
	)
})

export const Root = memo(() => {
	const [ready, setReady] = useState<boolean>(false)
	const [authed] = useIsAuthed()
	const initRef = useRef<boolean>(false)

	const setup = useCallback(async () => {
		try {
			await Promise.all([restoreQueries(), setupApp()])

			console.log("Setup done")

			setReady(true)
		} catch (e) {
			console.error(e)
		}
	}, [])

	useEffect(() => {
		const onPreloadError = (e: VitePreloadErrorEvent) => {
			e.preventDefault()
			e.stopPropagation()

			if (!IS_DESKTOP) {
				window.location.reload()
			}
		}

		window.addEventListener("vite:preloadError", onPreloadError)

		return () => {
			window.removeEventListener("vite:preloadError", onPreloadError)
		}
	}, [])

	useEffect(() => {
		if (!initRef.current) {
			initRef.current = true

			setup()
		}
	}, [setup])

	return (
		<main className="overflow-hidden antialiased">
			<ThemeProvider>
				<QueryClientProvider client={queryClient}>
					{!ready ? (
						<Loading />
					) : (
						<>
							<CookieConsent>
								{authed ? (
									<>
										<DropZone>
											<DragSelect>
												<Outlet />
											</DragSelect>
										</DropZone>
										<SelectDriveItemDialog />
										<SelectContactsDialog />
										<PublicLinkDialog />
										<SharedWithDialog />
										<FileVersionsDialog />
										<NoteHistoryDialog />
										<NoteParticipantsDialog />
										<CreateSyncDialog />
										<NotificationHandler />
										<ActivityHandler />
                                                                               <InfoDialog />
                                                                               <MetadataDialog />
                                                                               <StorageDialog />
										<ExportReminder />
										{IS_DESKTOP && (
											<>
												<DesktopHandler />
												<DesktopListener />
												<LockDialog />
											</>
										)}
									</>
								) : (
									<DropZone>
										<DragSelect>
											<Outlet />
										</DragSelect>
									</DropZone>
								)}
								<Transfers />
								<PreviewDialog />
								<InputDialog />
								<ConfirmDialog />
								<TransparentFullScreenImageDialog />
								<TwoFactorCodeDialog />
								<ProfileDialog />
								<DesktopUpdateDialog />
							</CookieConsent>
						</>
					)}
					<IsOnlineDialog />
					<RemoteConfigHandler />
					<MaintenanceDialog />
				</QueryClientProvider>
			</ThemeProvider>
			<Toaster />
		</main>
	)
})

export const Route = createRootRoute({
	component: Root,
	notFoundComponent: Page404
})
