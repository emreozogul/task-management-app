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
        <CollapsibleCard title="Quick Actions" icon={<ListTodo className="w-6 h-6 text-[#6775bc] mr-2" />} className="bg-[#232430] border-none shadow-lg h-[400px]">
            <div className="grid grid-cols-1 gap-4 flex-1">
                <Button
                    onClick={handleNewDocument}
                    className="w-full h-full bg-[#383844] hover:bg-[#4e4e59] text-white flex flex-col items-center justify-center space-y-3 border-2 border-[#4e4e59] hover:border-[#6775bc] transition-all"
                >
                    <FileText className="w-6 h-6" />
                    <span>New Document</span>
                </Button>
                <Link to="/boards/new" className="flex-1">
                    <Button className="w-full h-full bg-[#383844] hover:bg-[#4e4e59] text-white flex flex-col items-center justify-center space-y-3 border-2 border-[#4e4e59] hover:border-[#6775bc] transition-all">
                        <Trello className="w-6 h-6" />
                        <span>New Board</span>
                    </Button>
                </Link>
            </div>
        </CollapsibleCard>
    )
}