import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Layers,
    Users,
    ShieldCheck,
    Building2,
    CalendarCheck,
    FileText,
    ArrowRight,
} from "lucide-react";

import University from "./../assets/landingPage/university.png";
import Students from "./../assets/landingPage/students.png";
import Faculties from "./../assets/landingPage/faculties.png";
import Admin from "./../assets/landingPage/admin.png";
import Hostel from "./../assets/landingPage/hostel.png";
import Security from "./../assets/landingPage/security.png";
import Certificates from "./../assets/landingPage/certificate.png";

/* ------------------ Motion ------------------ */
const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut", staggerChildren: 0.2 },
    },
};

/* ------------------ Data ------------------ */
const modules = [
    {
        icon: Users,
        title: "Student Ecosystem",
        description:
            "Comprehensive profile management encompassing academic records, attendance tracking, and template-based application submissions for leaves or certificates with real-time status updates.",
        image: Students,
        alt: "Students using a university digital system",
        color: "text-blue-600",
        bg: "bg-blue-100",
    },
    {
        icon: Building2,
        title: "Academic Governance",
        description:
            "Empower HODs and Faculty with tools for workload balancing, course assignments, and multi-level approval chains for student requests and departmental notices.",
        image: Faculties,
        alt: "Faculty members working in a university office",
        color: "text-indigo-600",
        bg: "bg-indigo-100",
    },
    {
        icon: Layers,
        title: "Institutional Control",
        description:
            "Centralized management of universities, institutes, and departments. Configure fee structures, academic calendars, and role-based permissions with complete audit trails.",
        image: Admin,
        alt: "Administrative workspace for system configuration",
        color: "text-emerald-600",
        bg: "bg-emerald-100",
    },
    {
        icon: CalendarCheck,
        title: "Residential & Hostel Life",
        description:
            "Automated room allocation, hostel-specific attendance, and rule violation tracking integrated directly into the academic leave and fine management system.",
        image: Hostel,
        alt: "University hostel management environment",
        color: "text-amber-600",
        bg: "bg-amber-100",
    },
    {
        icon: ShieldCheck,
        title: "Gate & Campus Security",
        description:
            "Digital gate registers with ID verification. Validates approved leaves and day-outs in real-time while maintaining detailed entry-exit logs and incident reports.",
        image: Security,
        alt: "Campus security gate and monitoring system",
        color: "text-rose-600",
        bg: "bg-rose-100",
    },
    {
        icon: FileText,
        title: "Document Automation",
        description:
            "Eliminate manual formatting with template-driven generation of Bonafide certificates, NOCs, and event permissions, featuring secure admin verification before issuance.",
        image: Certificates,
        alt: "Official academic documents and certificates",
        color: "text-slate-600",
        bg: "bg-slate-100",
    },
];

const LandingPage = () => {
    const [active, setActive] = useState(0);        // desktop
    const [mobileActive, setMobileActive] = useState(null); // mobile

    return (
        <div className="bg-white text-slate-900">
            {/* ================= HERO ================= */}
            <section className="relative h-screen overflow-hidden bg-gray-200">
                <div className="h-full max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                            University Operations,
                            <br />
                            <span className="text-indigo-600">
                                Logic-Driven & Secure
                            </span>
                        </h1>

                        <p className="mt-8 text-lg text-slate-600 max-w-xl">
                            A robust full-stack solution designed to digitize academic,
                            administrative, and hostel workflows through standardized rules
                            and secure role-based access control.
                        </p>

                        <button className="mt-12 inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-indigo-600 text-white font-medium shadow hover:shadow-lg transition">
                            Explore System Features
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>

                    <img
                        src={University}
                        alt="Integrated university management interface"
                        className="hidden lg:block rounded-2xl object-contain max-h-[70vh]"
                    />
                </div>
            </section>

            {/* ================= MODULES SECTION (100VH) ================= */}
            <section
                id="modules"
                className="min-h-screen md:h-screen bg-slate-50 flex flex-col overflow-hidden"
            >
                {/* 1. Header Area */}
                <div className="pt-12 pb-8 px-6 md:px-8 text-center shrink-0">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                            Workflow-Driven Modules
                        </h2>
                        <p className="text-slate-500 mt-2">
                            Standardized automation across all university stakeholders.
                        </p>
                    </motion.div>
                </div>

                {/* 2. Main Content Area */}
                <div className="flex-1 min-h-0 max-w-7xl mx-auto w-full px-4 md:px-6 pb-12 flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* LEFT: Sidebar Tabs */}
                    <div className="md:w-1/3 lg:w-1/4 md:overflow-y-auto custom-scrollbar">
                        <div className="flex flex-col gap-3">
                            {modules.map((m, i) => (
                                <button
                                    key={m.title}
                                    onClick={() => setActive(i)}
                                    className={`group cursor-pointer relative p-4 rounded-xl flex items-center gap-4 transition-all duration-300 border ${active === i
                                            ? "bg-white border-slate-200 shadow-sm ring-1 ring-slate-200"
                                            : "bg-transparent border-transparent hover:bg-slate-200/50"
                                        }`}
                                >
                                    <div
                                        className={`shrink-0 p-2.5 rounded-lg transition-colors ${active === i ? m.bg : "bg-slate-200"
                                            }`}
                                    >
                                        <m.icon
                                            className={`w-5 h-5 ${active === i ? m.color : "text-slate-500"
                                                }`}
                                        />
                                    </div>

                                    <div className="text-left overflow-hidden">
                                        <p
                                            className={`font-bold text-sm truncate ${active === i ? "text-slate-900" : "text-slate-500"
                                                }`}
                                        >
                                            {m.title}
                                        </p>
                                    </div>

                                    {active === i && (
                                        <motion.div
                                            layoutId="activePill"
                                            className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-600"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Content Display */}
                    <div className="md:w-2/3 lg:w-3/4 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col h-full"
                            >
                                {/* Top Bar */}
                                <div className="px-6 py-4 bg-slate-50/50 flex items-center justify-between shrink-0 border-b border-slate-100">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-slate-200" />
                                        <div className="w-3 h-3 rounded-full bg-slate-200" />
                                        <div className="w-3 h-3 rounded-full bg-slate-200" />
                                    </div>
                                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                                        {modules[active].title} Specification
                                    </span>
                                </div>

                                {/* IMAGE - DESKTOP ONLY */}
                                <div className="hidden md:flex flex-1 relative overflow-hidden p-6 bg-slate-50">
                                    <img
                                        src={modules[active].image}
                                        alt={modules[active].alt}
                                        className="w-full h-full object-contain rounded-xl drop-shadow-2xl"
                                    />
                                </div>

                                {/* Bottom Content */}
                                <div className="p-5 md:p-8 bg-white border-t border-slate-100 shrink-0">
                                    <div className="max-w-2xl">
                                        <h4 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                                            <span
                                                className={`w-2 h-6 rounded-full ${modules[
                                                    active
                                                ].bg.replace("100", "500")}`}
                                            />
                                            Functional Overview
                                        </h4>
                                        <p className="text-slate-600 leading-relaxed">
                                            {modules[active].description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>



            {/* ================= FINAL ================= */}
            <section className="relative h-screen flex items-center overflow-hidden bg-gray-200">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl" />

                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-4xl md:text-5xl font-bold tracking-tight"
                    >
                        Built for Accountability,
                        <br />
                        <span className="text-indigo-600">Driven by Governance</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.7 }}
                        className="mt-8 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
                    >
                        Moving beyond basic dashboards, this system implements multi-level
                        approval chains (Faculty → HOD → Hostel → Guard) to ensure every
                        action is validated and recorded in a permanent audit trail.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="mt-14 flex flex-col sm:flex-row justify-center gap-4"
                    >
                        <button
                            className="px-10 py-4 rounded-xl bg-indigo-600 text-white font-medium shadow-md hover:shadow-xl transition"
                        >
                            View Technical Documentation
                        </button>

                        <a
                            href="#modules"
                            className="px-10 py-4 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-white transition"
                        >
                            Review System Modules
                        </a>
                    </motion.div>
                </div>
            </section>

        </div>
    );
};

export default LandingPage;
