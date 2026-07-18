import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FragranceNotesProps {
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  noteDescriptions: {
    [key: string]: string;
  };
}

type NoteType = 'top' | 'heart' | 'base';

export const FragranceNotes: React.FC<FragranceNotesProps> = ({
  notes,
  noteDescriptions,
}) => {
  const [activeNote, setActiveNote] = useState<string | null>(notes.top[0] || null);
  const [hoveredNote, setHoveredNote] = useState<string | null>(null);

  const displayedNote = hoveredNote || activeNote;

  const renderNoteList = (title: string, noteList: string[], type: NoteType) => {
    return (
      <div className="flex-1 flex flex-col space-y-4" id={`notes-${type}`}>
        <h4 className="text-[10px] tracking-[0.25em] uppercase font-sans text-foreground/40 font-medium">
          {title}
        </h4>
        <ul className="space-y-2 relative">
          {noteList.map((note) => {
            const isSelected = displayedNote === note;
            return (
              <li
                key={note}
                onMouseEnter={() => setHoveredNote(note)}
                onMouseLeave={() => setHoveredNote(null)}
                onClick={() => setActiveNote(note)}
                className={`
                  relative py-2 pl-4 cursor-pointer text-sm font-sans tracking-wide transition-colors duration-300 select-none
                  ${isSelected ? 'text-foreground font-medium' : 'text-foreground/50 hover:text-foreground'}
                `}
              >
                {/* Sliding hairline indicator on the left side of the active note */}
                {isSelected && (
                  <motion.div
                    layoutId="hairline-indicator"
                    className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent-gold md:bg-foreground origin-center"
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
                {note}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-8 py-8 border-t border-b border-cream" id="fragrance-notes-widget">
      {/* Three Column Grid */}
      <div className="grid grid-cols-3 gap-6 md:gap-12">
        {renderNoteList('01 / Top Notes', notes.top, 'top')}
        {renderNoteList('02 / Heart Notes', notes.heart, 'heart')}
        {renderNoteList('03 / Base Notes', notes.base, 'base')}
      </div>

      {/* Description Panel with Smooth Height and Opacity Transition */}
      <div className="relative overflow-hidden bg-cream/40 border border-cream p-6 rounded-none min-h-[120px]">
        <AnimatePresence mode="wait">
          {displayedNote && noteDescriptions[displayedNote] ? (
            <motion.div
              key={displayedNote}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col space-y-2"
            >
              <h5 className="font-serif italic text-lg text-foreground font-medium">
                {displayedNote}
              </h5>
              <p className="text-sm font-sans text-foreground/70 font-light leading-relaxed max-w-2xl">
                {noteDescriptions[displayedNote]}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm italic font-serif text-foreground/40 font-light"
            >
              Hover or click on any ingredient above to uncover its olfactive depth.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
