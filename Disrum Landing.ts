import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mic } from "lucide-react";
import AiDock from "@/components/AiDock";

export default function LandingPage() {
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
        <div className= "min-h-screen flex flex-col" >
        {/* Hero Section */ }
        < header className = "bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 text-center" >
            <h1 className="text-5xl font-bold mb-4" > Welcome to Disrum </h1>
                < p className = "text-lg mb-6" > Revolutionizing the way you connect with AI - powered solutions.</p>
                    < div className = "flex justify-center gap-4" >
                        <Button className="bg-white text-blue-500 px-6 py-3 rounded-full shadow-lg" >
                            Get Started
                                </Button>
                                < AiDock />
                                </div>
                                </header>

    {/* Features Section */ }
    <section className="py-16 bg-gray-100 text-center" >
        <h2 className="text-3xl font-bold mb-8" > Why Choose Disrum ? </h2>
            < div className = "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto" >
                <div className="p-6 bg-white shadow rounded-lg" >
                    <h3 className="text-xl font-semibold mb-2" > AI - Powered Insights </h3>
                        < p > Leverage cutting - edge AI to gain actionable insights and make informed decisions.</p>
                            </div>
                            < div className = "p-6 bg-white shadow rounded-lg" >
                                <h3 className="text-xl font-semibold mb-2" > User - Friendly Interface </h3>
                                    < p > Enjoy a seamless and intuitive experience designed for everyone.</p>
                                        </div>
                                        < div className = "p-6 bg-white shadow rounded-lg" >
                                        <h3 className= "text-xl font-semibold mb-2" > 24 / 7 Support </h3>
                                            < p > Our team is here to assist you anytime, anywhere.</p>
                                                </div>
                                                </div>
                                                </section>

    {/* Call-to-Action Section */ }
    <section className="py-16 bg-blue-500 text-white text-center" >
        <h2 className="text-3xl font-bold mb-4" > Ready to Get Started ? </h2>
            < p className = "mb-6" > Join thousands of users who trust Disrum for their AI needs.</p>
                < Button className = "bg-white text-blue-500 px-6 py-3 rounded-full shadow-lg" >
                    Sign Up Now
                        </Button>
                        </section>

    {/* Footer */ }
    <footer className="bg-gray-800 text-white py-6 text-center" >
        <p>& copy; { new Date().getFullYear() } Disrum.All rights reserved.</p>
            </footer>

    {/* AI Mentor Dialog */ }
    <Dialog open={ open } onOpenChange = { setOpen } >
        <DialogContent className="p-4 max-w-xl" >
            <DialogHeader>
            <DialogTitle>AI Mentor </DialogTitle>
                </DialogHeader>
                < Textarea
    value = { input }
    onChange = {(e) => setInput(e.target.value)
}
placeholder = "Ask a question, get inspired..."
className = "mb-2"
    />
    <div className="flex gap-2" >
        <Button onClick={ handleQuery } disabled = { loading } className = "w-full" >
            { loading?<Loader2 className = "animate-spin" /> : "Submit"}
</Button>
    < Button onClick = { handleVoiceInput } disabled = { listening } className = "bg-gray-200 text-black" >
        <Mic className={ listening ? "animate-pulse" : "" } />
            </Button>
            </div>
{ response && <div className="mt-4 whitespace-pre-line text-sm text-gray-700" > { response } </div> }
</DialogContent>
    </Dialog>
    </div>
    );
}
