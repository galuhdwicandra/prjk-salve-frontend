import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { getErrorMessage } from '../../api/client';
import {
  createWhatsappTemplate,
  listWhatsappTemplates,
  updateWhatsappTemplate,
} from '../../api/whatsappTemplates';
import Toast from '../../components/Toast';
import { useToast } from '../../hooks/useToast';
import { useActiveBranchId } from '../../store/useBranch';
import type { WaConfigKey } from '../../types/whatsapp-templates';
import { IconChevron, IconWa } from '../users/icons';
import {
  WA_TEMPLATE_DEFAULTS,
  WA_TEMPLATE_DEFS,
  waRender,
  waSampleVars,
} from '../../utils/wa-templates';

type DraftMap = Record<WaConfigKey, string>;
type IdMap = Partial<Record<WaConfigKey, string>>;

function renderBold(text: string): ReactNode[] {
  return text
    .split(/\*([^*\n]+)\*/g)
    .map((part, i) => (i % 2 === 1 ? <b key={i}>{part}</b> : part));
}

export default function WhatsappTemplatesPage() {
  const branchId = useActiveBranchId();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [drafts, setDrafts] = useState<DraftMap>(WA_TEMPLATE_DEFAULTS);
  const [ids, setIds] = useState<IdMap>({});
  const [open, setOpen] = useState<WaConfigKey | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const areas = useRef<Partial<Record<WaConfigKey, HTMLTextAreaElement | null>>>({});
  const sample = useRef(waSampleVars());

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listWhatsappTemplates({ per_page: 100 });
      const rows = res.data ?? [];
      const nextDrafts = { ...WA_TEMPLATE_DEFAULTS };
      const nextIds: IdMap = {};

      WA_TEMPLATE_DEFS.forEach((def) => {
        const row = rows.find(
          (item) =>
            item.key === def.key &&
            String(item.branch_id ?? '') === String(branchId ?? ''),
        );
        if (!row) return;
        nextIds[def.key] = row.id;
        if (row.content.trim()) nextDrafts[def.key] = row.content;
      });

      setDrafts(nextDrafts);
      setIds(nextIds);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat template WhatsApp.'));
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  function insertVar(key: WaConfigKey, value: string) {
    const area = areas.current[key];
    if (!area) return;
    const start = area.selectionStart ?? 0;
    const end = area.selectionEnd ?? 0;
    const next = drafts[key].slice(0, start) + value + drafts[key].slice(end);
    setDrafts((prev) => ({ ...prev, [key]: next }));
    window.requestAnimationFrame(() => {
      area.focus();
      area.selectionStart = start + value.length;
      area.selectionEnd = start + value.length;
    });
  }

  async function saveAll() {
    setSaving(true);
    setError(null);
    try {
      await Promise.all(
        WA_TEMPLATE_DEFS.map((def) => {
          const payload = {
            branch_id: branchId || null,
            key: def.key,
            name: def.label,
            content: drafts[def.key],
            is_active: true,
          };
          const id = ids[def.key];
          return id
            ? updateWhatsappTemplate(id, payload)
            : createWhatsappTemplate(payload);
        }),
      );
      await refresh();
      showSuccess('Template WhatsApp disimpan');
    } catch (err) {
      showError(getErrorMessage(err, 'Gagal menyimpan template WhatsApp.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="card">
        <div className="card-title">
          Konfigurasi Pesan WhatsApp
          <span className="ct-note">atur template pesan ke pelanggan</span>
        </div>
        <p className="mini" style={{ margin: '8px 0 0', lineHeight: 1.6 }}>
          Tulis pesan dan sisipkan variabel di dalam kurung kurawal (mis. <code>{'{nama}'}</code>) —
          nanti otomatis diganti dengan data order/pelanggan saat dikirim. Bungkus teks dengan
          tanda bintang (<code>*tebal*</code>) untuk cetak tebal di WhatsApp.
        </p>
      </div>

      {error ? (
        <div className="card" style={{ color: 'var(--danger)' }}>{error}</div>
      ) : null}

      {loading ? (
        <div className="card mini">Memuat…</div>
      ) : (
        WA_TEMPLATE_DEFS.map((def) => {
          const isOpen = open === def.key;
          return (
            <div className="wa-acc" key={def.key}>
              <div
                className="wa-achd"
                onClick={() => setOpen(isOpen ? null : def.key)}
              >
                <span className={isOpen ? 'wa-caret open' : 'wa-caret'}>
                  <IconChevron />
                </span>
                <b>{def.label}</b>
              </div>

              {isOpen ? (
                <div className="wa-abody">
                  <p className="mini" style={{ margin: '2px 0 8px' }}>{def.desc}</p>

                  <div className="wa-chips">
                    <span>Sisipkan:</span>
                    {def.vars.map((v) => (
                      <button
                        key={v}
                        type="button"
                        className="wa-chip"
                        onClick={() => insertVar(def.key, v)}
                      >
                        {v}
                      </button>
                    ))}
                  </div>

                  <textarea
                    className="wa-ta"
                    rows={7}
                    ref={(el) => { areas.current[def.key] = el; }}
                    value={drafts[def.key]}
                    onChange={(e) =>
                      setDrafts((prev) => ({ ...prev, [def.key]: e.target.value }))
                    }
                  />

                  <div className="wa-prev-wrap">
                    <div className="mini" style={{ marginBottom: 5 }}>
                      Pratinjau (contoh data):
                    </div>
                    <div className="wa-bubble">
                      {renderBold(waRender(drafts[def.key], sample.current))}
                    </div>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <button
                      type="button"
                      className="link"
                      onClick={() =>
                        setDrafts((prev) => ({
                          ...prev,
                          [def.key]: WA_TEMPLATE_DEFAULTS[def.key],
                        }))
                      }
                    >
                      Kembalikan ke default
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })
      )}

      <div className="wa-savebar">
        <button type="button" className="btn" disabled={saving} onClick={() => void saveAll()}>
          <IconWa /> {saving ? 'Menyimpan…' : 'Simpan Semua Template'}
        </button>
      </div>

      <Toast
        show={toast.open}
        message={toast.message}
        kind={toast.kind}
        onClose={hideToast}
      />
    </>
  );
}
