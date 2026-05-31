"use client";

import { useState } from "react";
import { VolumeIcon } from "@/components/ui-icons";

type SpeakButtonProps = {
  text: string;
  lang: "tr-TR" | "fr-FR";
  label: string;
  className?: string;
};

export function SpeakButton({ text, lang, label, className = "icon-button" }: SpeakButtonProps) {
  const [status, setStatus] = useState("");

  function speak() {
    if (!("speechSynthesis" in window)) {
      setStatus("Tarayıcı sesli dinlemeyi desteklemiyor.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
    setStatus("");
  }

  return (
    <span className="speak-control">
      <button type="button" className={className} onClick={speak} aria-label={label}>
        <VolumeIcon />
      </button>
      {status ? <small>{status}</small> : null}
    </span>
  );
}
