import { Notebook, Plus } from "lucide-react"
import { Button } from "@components/ui/button"
import { useTranslation } from "react-i18next"
import eventEmitter from "@/lib/eventEmitter"

export default function EmptyState() {
        const { t } = useTranslation()

        function create() {
                eventEmitter.emit("createNote")
        }

        return (
                <div className="flex flex-row items-center justify-center w-full h-full">
                        <div className="flex flex-col p-4 justify-center items-center">
                                <Notebook width={128} height={128} className="text-muted-foreground" />
                                <p className="text-xl text-center mt-4">{t("notes.empty.title")}</p>
                                <p className="text-muted-foreground text-center">{t("notes.empty.description")}</p>
                                <Button variant="secondary" className="items-center gap-2 mt-4" onClick={create}>
                                        <Plus size={16} />
                                        {t("notes.empty.create")}
                                </Button>
                        </div>
                </div>
        )
}
