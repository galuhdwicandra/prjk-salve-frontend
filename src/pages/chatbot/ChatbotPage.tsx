import { useEffect, useState } from 'react';
import {
  CHAT_SLOT_STEPS,
  ensureChatSession,
  setChatSlot,
  setChatStep,
  startChatSession,
  useChatSession,
} from '../../store/useChatSession';
import type { ChatSlotKey } from '../../store/useChatSession';
import { Link } from 'react-router-dom';

interface QuestionDef {
  text: string;
  kind: 'text' | 'tel' | 'date';
  optional: boolean;
}

const QUESTIONS: Record<ChatSlotKey, QuestionDef> = {
  customerName: { text: 'Halo! Pesanan ini atas nama siapa?', kind: 'text', optional: false },
  customerWa: { text: 'Nomor WhatsApp yang bisa dihubungi?', kind: 'tel', optional: false },
  receivedAt: { text: 'Sepatu diterima tanggal berapa?', kind: 'date', optional: false },
  readyAt: { text: 'Target selesai tanggal berapa?', kind: 'date', optional: true },
  notes: { text: 'Ada catatan tambahan untuk pesanan ini?', kind: 'text', optional: true },
};

function bubbleRow(align: 'left' | 'right') {
  return {
    display: 'flex',
    justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
  } as const;
}

export default function ChatbotPage() {
  const session = useChatSession();
  const [draft, setDraft] = useState('');

  useEffect(() => {
    ensureChatSession();
  }, []);

  if (!session) return <div className="card mini">Menyiapkan percakapan…</div>;

  const stepIndex =
    session.step === 'confirm'
      ? CHAT_SLOT_STEPS.length
      : CHAT_SLOT_STEPS.indexOf(session.step);

  const answered = CHAT_SLOT_STEPS.slice(0, stepIndex);
  const question = session.step === 'confirm' ? null : QUESTIONS[session.step];

  function answer() {
    if (session === null || session.step === 'confirm') return;

    const value = draft.trim();

    if (!value && !QUESTIONS[session.step].optional) return;

    setChatSlot(session.step, value);
    setChatStep(session.notice ? 'confirm' : CHAT_SLOT_STEPS[stepIndex + 1] ?? 'confirm');
    setDraft('');
  }

  function restart() {
    startChatSession();
    setDraft('');
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Bot Order</h1>
          <div className="ph-sub">Satu percakapan mewakili satu pesanan.</div>
        </div>
        <button type="button" className="btn ghost" onClick={restart}>
          Mulai Percakapan Baru
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'grid', gap: 10 }}>
          {answered.map((key) => (
            <div key={key} style={{ display: 'grid', gap: 6 }}>
              <div style={bubbleRow('left')}>
                <div className="wa-bubble">{QUESTIONS[key].text}</div>
              </div>
              <div style={bubbleRow('right')}>
                <div className="wa-bubble" style={{ background: '#eef2f8' }}>
                  {session.slots[key] || '(dilewati)'}
                </div>
              </div>
            </div>
          ))}

          {session.notice ? (
            <div style={bubbleRow('left')}>
              <div className="wa-bubble" role="alert">
                {session.notice.message}
                {session.notice.offerPos ? (
                  <>
                    {' '}
                    <Link to="/pos">Lanjutkan di form POS</Link>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}

          {question ? (
            <div style={bubbleRow('left')}>
              <div className="wa-bubble">{question.text}</div>
            </div>
          ) : (
            <div style={bubbleRow('left')}>
              <div className="wa-bubble">
                Semua pertanyaan sudah terjawab. Pesanan siap diproses.
              </div>
            </div>
          )}
        </div>

        {question ? (
          <div className="row" style={{ marginTop: 16 }}>
            <input
              className="inp"
              type={question.kind}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') answer();
              }}
              placeholder={question.optional ? 'Boleh dikosongkan' : 'Ketik jawaban…'}
              aria-label={question.text}
            />
            <button
              type="button"
              className="btn"
              style={{ flex: 'none' }}
              onClick={answer}
            >
              Kirim
            </button>
          </div>
        ) : null}
      </div>

      <div className="card mini">
        client_ref sesi ini: <span className="mono">{session.clientRef}</span>
      </div>
    </>
  );
}
