import { getDesktopConfig } from "@/hooks/useDesktopConfig"

export function isSyncPathAlreadyInConfig(type: "local" | "remote", path: string): boolean {
    const desktopConfig = getDesktopConfig()
    const sep = type === "local" ? (window.desktopAPI.osPlatform() === "win32" ? "\\" : "/") : "/"
    const configuredPaths =
        type === "local"
            ? desktopConfig.syncConfig.syncPairs.map(pair => pair.localPath)
            : desktopConfig.syncConfig.syncPairs.map(pair => pair.remotePath)

    for (const configuredPath of configuredPaths) {
        if (path.startsWith(configuredPath + sep) || configuredPath.startsWith(path + sep)) {
            return true
        }
    }

    return false
}

export function doesSyncNameExist(name: string): boolean {
    const desktopConfig = getDesktopConfig()

    return desktopConfig.syncConfig.syncPairs.some(pair => pair.name.trim() === name.trim())
}

export function tryingToSyncNetworkDrive(path: string): boolean {
    const desktopConfig = getDesktopConfig()
    const sep = window.desktopAPI.osPlatform() === "win32" ? "\\" : "/"

    return path.startsWith(desktopConfig.networkDriveConfig.mountPoint + sep)
}
