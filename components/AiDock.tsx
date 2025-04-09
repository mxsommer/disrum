import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mic } from "lucide-react";

export default function AiDock() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [listening, setListening] = useState(false);

    useEffect(() => {
        if (!open) return;
        const context = document.title + " - " + window.location.pathname;
        setInput((prev) => prev || `Context: ${context}\n`);
    }, [open]);

    const handleQuery = async () => {
        setLoading(true);
        try {
            const res = await fetch("https://api.bysommer.net/ai/mentor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: input }),
            });
            const data = await res.json();
            setResponse(data.response);
        } catch (err) {
            setResponse("Error reaching AI service.");
        } finally {
            setLoading(false);
        }
    };

    const handleVoiceInput = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setListening(true);
        recognition.start();

        recognition.onresult = (event) => {
            const speech = event.results[0][0].transcript;
            setInput((prev) => prev + " " + speech);
            setListening(false);
        };

        recognition.onerror = () => {
            setListening(false);
        };
    };

    return (
        <div>
            <Button onClick={() => setOpen(true)} className="bg-white text-blue-500 px-6 py-3 rounded-full shadow-lg">
                Ask AI Mentor
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-4 max-w-xl">
                    <DialogHeader>
                        <DialogTitle>AI Mentor</DialogTitle>
                    </DialogHeader>
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question, get inspired..."
                        className="mb-2"
                    />
                    <div className="flex gap-2">
                        <Button onClick={handleQuery} disabled={loading} className="w-full">
                            {loading ? <Loader2 className="animate-spin" /> : "Submit"}
                        </Button>
                        <Button onClick={handleVoiceInput} disabled={listening} className="bg-gray-200 text-black">
                            <Mic className={listening ? "animate-pulse" : ""} />
                        </Button>
                    </div>
                    {response && <div className="mt-4 whitespace-pre-line text-sm text-gray-700">{response}</div>}
                </DialogContent>
            </Dialog>
        </div>
    );
}
