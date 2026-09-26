import { useEffect, useRef, useState } from 'react';
import { normalizeApiError } from '../../api/client';
import { useActiveBranchId } from '../../store/useBranch';
import {
  CHAT_SLOT_STEPS,
  ensureChatSession,
  setChatSlot,
  setChatStep,
  startChatSession,
  submitChatOrder,
  useChatSession,
} from '../../store/useChatSession';
import type { ChatSlotKey } from '../../store/useChatSession';

interface QuestionDef {
  text: string;
  kind: 'text' | 'tel' | 'date' | 'choice';
  optional: boolean;
  options?: { value: string; label: string }[];
}

const QUESTIONS: Record<ChatSlotKey, QuestionDef> = {
  customerName: { text: 'Halo! Pesanan ini atas nama siapa?', kind: 'text', optional: false },
  customerWa: { text: 'Nomor WhatsApp yang bisa dihubungi?', kind: 'tel', optional: false },
  receivedAt: { text: 'Sepatu diterima tanggal berapa?', kind: 'date', optional: false },
  readyAt: { text: 'Target selesai tanggal berapa?', kind: 'date', optional: false },
  notes: { text: 'Ada catatan tambahan untuk pesanan ini?', kind: 'text', optional: true },
  payMode: {
    text: 'Pembayarannya bagaimana?',
    kind: 'choice',
    optional: false,
    options: [
      { value: 'FULL', label: 'FULL — dibayar lunas di depan' },
      { value: 'DP', label: 'DP — bayar sebagian di depan' },
      { value: 'PENDING', label: 'PENDING — bayar nanti' },
    ],
  },
};

function displayAnswer(key: ChatSlotKey, value: string): string {
  return QUESTIONS[key].options?.find((option) => option.value === value)?.label ?? value;
}

function bubbleRow(align: 'left' | 'right') {
  return {
    display: 'flex',
    justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
  } as const;
}

export default function ChatbotPage() {
  const session = useChatSession();
  const branchId = useActiveBranchId();
  const [draft, setDraft] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const submitLockRef = useRef(false);

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

  function answer(raw: string) {
    if (session === null || session.step === 'confirm') return;

    const value = raw.trim();

    if (!value && !QUESTIONS[session.step].optional) return;

    setChatSlot(session.step, value);
    setChatStep(CHAT_SLOT_STEPS[stepIndex + 1] ?? 'confirm');
    setDraft('');
  }

  function restart() {
    startChatSession();
    setDraft('');
    setNotice(null);
  }

  async function save() {
    if (submitLockRef.current) return;

    submitLockRef.current = true;
    setSaving(true);
    setNotice(null);

    try {
      const result = await submitChatOrder(branchId);

      if (result.ok) {
        startChatSession();
        setNotice(result.reference ? `Order ${result.reference} berhasil dibuat.` : 'Order berhasil dibuat.');
      } else if (result.missing.length > 0) {
        setNotice(`Belum bisa disimpan. Yang masih kurang: ${result.missing.join(', ')}.`);
      }
    } catch (err: unknown) {
      setNotice(normalizeApiError(err).message || 'Gagal menyimpan order');
    } finally {
      submitLockRef.current = false;
      setSaving(false);
    }
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
                  {session.slots[key] ? displayAnswer(key, session.slots[key]) : '(dilewati)'}
                </div>
              </div>
            </div>
          ))}

          {question ? (
            <div style={bubbleRow('left')}>
              <div className="wa-bubble">{question.text}</div>
            </div>
          ) : (
            <div style={bubbleRow('left')}>
              <div className="wa-bubble">
                Semua pertanyaan sudah terjawab. Pilih Simpan untuk membuat pesanan.
              </div>
            </div>
          )}

          {notice ? (
            <div style={bubbleRow('left')}>
              <div className="wa-bubble">{notice}</div>
            </div>
          ) : null}
        </div>

        {question?.kind === 'choice' ? (
          <div className="row" style={{ marginTop: 16, flexWrap: 'wrap' }}>
            {question.options?.map((option) => (
              <button
                key={option.value}
                type="button"
                className="btn ghost"
                onClick={() => answer(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : question ? (
          <div className="row" style={{ marginTop: 16 }}>
            <input
              className="inp"
              type={question.kind}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') answer(draft);
              }}
              placeholder={question.optional ? 'Boleh dikosongkan' : 'Ketik jawaban…'}
              aria-label={question.text}
            />
            <button
              type="button"
              className="btn"
              style={{ flex: 'none' }}
              onClick={() => answer(draft)}
            >
              Kirim
            </button>
          </div>
        ) : (
          <div className="row" style={{ marginTop: 16 }}>
            <button type="button" className="btn" disabled={saving} onClick={save}>
              {saving ? 'Menyimpan…' : 'Simpan'}
            </button>
          </div>
        )}
      </div>

      <div className="card mini">
        client_ref sesi ini: <span className="mono">{session.clientRef}</span>
      </div>
    </>
  );
}
