export const generateClinicalPDF = (p) => {
    const scriptId = 'jspdf-cdn-script';
    
    const runGenerator = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Brand Colors
        const primaryColor = [37, 99, 235];    // Blue 600
        const secondaryColor = [30, 41, 59];   // Slate 900
        const accentColor = [100, 116, 139];    // Slate 500
        const borderColor = [226, 232, 240];   // Slate 200

        // 1. Header with Gradient-like effect
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 45, 'F');
        
        // Title & Branding
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(26);
        doc.text("Clinic Management System", 20, 25);
        
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text("OFFICIAL CLINICAL RECORD • CONFIDENTIAL", 20, 34);

        // 2. Patient & Provider Information Grid
        doc.setTextColor(...secondaryColor);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("DOCUMENT DETAILS", 20, 60);
        
        doc.setDrawColor(...borderColor);
        doc.line(20, 62, 190, 62);

        // Grid Logic
        let y = 72;
        const drawRow = (label, value) => {
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...accentColor);
            doc.text(`${label.toUpperCase()}`, 20, y);
            
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...secondaryColor);
            doc.setFontSize(11);
            doc.text(`${value}`, 65, y);
            y += 10;
        };

        drawRow("Patient Name", p.patientName);
        drawRow(p.role === 'receptionist' ? 'Staff Member' : 'Attending Physician', p.doctorName);
        drawRow("Clinic Role", p.role.charAt(0).toUpperCase() + p.role.slice(1));
        drawRow("Record Date", new Date(p.date).toLocaleDateString());
        drawRow("Report ID", `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);

        // 3. Clinical Notes Section
        y += 10;
        doc.setFillColor(248, 250, 252); // Very light slate bg
        doc.rect(20, y, 170, 10, 'F');
        
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...primaryColor);
        doc.setFontSize(12);
        doc.text("CLINICAL NOTES & INSTRUCTIONS", 25, y + 7);
        
        y += 20;
        doc.setTextColor(...secondaryColor);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        
        const notes = p.notes || "No clinical notes or specific instructions provided for this session.";
        const splitText = doc.splitTextToSize(notes, 170);
        doc.text(splitText, 20, y);

        // 4. Footer
        const pageHeight = doc.internal.pageSize.height;
        
        // Border above footer
        doc.setDrawColor(...borderColor);
        doc.line(20, pageHeight - 25, 190, pageHeight - 25);
        
        doc.setFontSize(8);
        doc.setTextColor(...accentColor);
        doc.text("This document is a formal clinical record generated via the Clinic Management System portal.", 105, pageHeight - 18, { align: "center" });
        doc.text("Confidentiality Notice: This document is intended solely for the use of the individual or entity to whom it is addressed.", 105, pageHeight - 14, { align: "center" });
        
        // Page Numbering
        doc.text(`Page 1 of 1`, 190, pageHeight - 10, { align: "right" });

        doc.save(`Clinical_Record_${p.patientName.replace(/\s+/g, '_')}.pdf`);
    };

    // Script injection guard
    if (window.jspdf) {
        runGenerator();
    } else {
        const existingScript = document.getElementById(scriptId);
        if (existingScript) {
            existingScript.onload = runGenerator;
        } else {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = runGenerator;
            document.head.appendChild(script);
        }
    }
};