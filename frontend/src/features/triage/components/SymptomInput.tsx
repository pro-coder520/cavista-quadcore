import React, { useState } from "react";

interface SymptomInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

const COMMON_SYMPTOMS = [
    "Headache",
    "Fever",
    "Cough",
    "Fatigue",
    "Chest Pain",
    "Shortness of Breath",
    "Nausea",
    "Dizziness",
    "Joint Pain",
    "Skin Rash",
];

export function SymptomInput({
    value,
    onChange,
    disabled = false,
}: SymptomInputProps): React.ReactNode {
    const [showChips, setShowChips] = useState(true);

    const addSymptom = (symptom: string): void => {
        const current = value.trim();
        if (current) {
            onChange(`${current}, ${symptom.toLowerCase()}`);
        } else {
            onChange(symptom.toLowerCase());
        }
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-[var(--color-text)]">
                Describe your symptoms
            </label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                placeholder="e.g., I've had a persistent headache for 3 days, along with mild fever and fatigue. The headache is mostly on the right side..."
                className="w-full h-32 px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:opacity-50"
                rows={5}
            />
            <p className="text-xs text-[var(--color-text-muted)]">
                Include duration, location, severity, and any other relevant details.
            </p>

            {showChips && (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                            Quick add:
                        </span>
                        <button
                            type="button"
                            onClick={() => setShowChips(false)}
                            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
                        >
                            Hide
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {COMMON_SYMPTOMS.map((symptom) => (
                            <button
                                key={symptom}
                                type="button"
                                onClick={() => addSymptom(symptom)}
                                disabled={disabled}
                                className="px-3 py-1 text-xs rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {symptom}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
