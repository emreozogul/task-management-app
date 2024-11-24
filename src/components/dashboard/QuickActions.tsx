import { Button } from "../ui/button"
import { FileText, Trello, ListTodo } from "lucide-react"
import { Link } from "react-router-dom"
import { CollapsibleCard } from "../ui/collapsible-card"
import { useDocumentStore } from "@/stores/documentStore"
import { useNavigate } from "react-router-dom"

export const QuickActions = () => {
    const { createDocument } = useDocumentStore();
    const navigate = useNavigate();
    const handleNewDocument = () => {
        const timestamp = Date.now().toString(16);
        const newDoc = createDocument(`Document - ${timestamp}`, 'general');
        navigate(`/documents/${newDoc.id}`);
    };

    return (
        <CollapsibleCard
            title="Quick Actions"
            icon={<ListTodo className="w-6 h-6 text-primary mr-2" />}
            className="bg-background-secondary border-none shadow-lg h-[400px]"
        >
            <div className="grid grid-cols-1 gap-4 flex-1">
                <Button
                    onClick={handleNewDocument}
                    className="w-full h-full bg-background-hover hover:bg-background-hover-dark text-primary-foreground flex flex-col items-center justify-center space-y-3 border-2 border-border hover:border-primary transition-all"
                >
                    <FileText className="w-6 h-6" />
                    <span>New Document</span>
                </Button>
                <Link to="/boards/new" className="flex-1">
                    <Button
                        className="w-full h-full bg-background-hover hover:bg-background-hover-dark text-primary-foreground flex flex-col items-center justify-center space-y-3 border-2 border-border hover:border-primary transition-all"
                    >
                        <Trello className="w-6 h-6" />
                        <span>New Board</span>
                    </Button>
                </Link>
            </div>
        </CollapsibleCard>
    )
}