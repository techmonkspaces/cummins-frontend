import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { RecordingMethod } from '../../types';

export interface DemoStepInfo {
  step: number;
  title: string;
  shortDesc: string;
}

const DEMO_STEPS: DemoStepInfo[] = [
  { step: 1, title: '1. Select Product', shortDesc: 'Select GA-102 Gear Assembly' },
  { step: 2, title: '2. Choose Method', shortDesc: 'Compare 3 recording methods' },
  { step: 3, title: '3. Inventory (A)', shortDesc: '500kg Cardboard ÷ 1,000 units' },
  { step: 4, title: '4. Calculated (B)', shortDesc: 'Rule engine BOM recommendations' },
  { step: 5, title: '5. User Input (C)', shortDesc: 'Operator floor manual log' },
  { step: 6, title: '6. Review Summary', shortDesc: 'Common review & PPWR analysis' },
  { step: 7, title: '7. Confirm Record', shortDesc: 'Commit to PPWR data model' },
  { step: 8, title: '8. Audit & Export', shortDesc: 'Verify method provenance & export' }
];

interface DemoGuideBarProps {
  currentDemoStep: number;
  onSelectDemoStep: (stepNumber: number) => void;
}

export const DemoGuideBar: React.FC<DemoGuideBarProps> = ({
  currentDemoStep,
  onSelectDemoStep,
}) => {
  return (
    <div className="demo-guide-bar">
      <div className="demo-guide-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          <div className="demo-story-pill">
            <Sparkles size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
            Demo Story Walkthrough
          </div>
          <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>
            Follow the 8-stage evaluator path:
          </span>
        </div>

        <div className="demo-steps-track">
          {DEMO_STEPS.map((s) => {
            const isActive = currentDemoStep === s.step;
            const isPast = currentDemoStep > s.step;

            return (
              <button
                key={s.step}
                className={`demo-step-chip ${isActive ? 'active' : ''}`}
                onClick={() => onSelectDemoStep(s.step)}
                title={s.shortDesc}
              >
                {isPast ? (
                  <CheckCircle2 size={12} color="#10B981" />
                ) : (
                  <span className="demo-step-num">{s.step}</span>
                )}
                <span>{s.title.replace(/^\d+\.\s*/, '')}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
