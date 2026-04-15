import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  listWhatsappTemplates,
  createWhatsappTemplate,
  updateWhatsappTemplate,
} from '../../api/whatsappTemplates';
import { listBranches } from '../../api/branches';
import { useAuth } from '../../store/useAuth';

type BranchOption = {
  id: string;
  name: string;
};

type FormState = {
  id?: string;
  branch_id: string | null;
  key: 'receipt_pending' | 'receipt_paid';
  name: string;
  content: string;
  is_active: boolean;
};

type ApiErrorShape = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

type TemplateCardProps = {
  title: string;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onSave: () => void;
  saving: boolean;
  branches: BranchOption[];
  isSuperadmin: boolean;
  helpPlaceholders: string[];
};

const DEFAULT_PENDING = `Halo {{customer_name}},
Berikut tagihan laundry Anda.
Kwitansi: {{share_url}}
No: {{invoice_no}}
Total: {{grand_total}}
Mohon melakukan pembayaran.
{{app_name}}`;

const DEFAULT_PAID = `Halo {{customer_name}},
Terima kasih atas pembayarannya.
Kwitansi: {{share_url}}
No: {{invoice_no}}
Total: {{grand_total}}
Terima kasih sudah menggunakan layanan kami.
{{app_name}}`;

function getErrorMessage(error: unknown, fallback: string): string {
  const err = error as ApiErrorShape;
  return err.response?.data?.message ?? fallback;
}

export default function WhatsappTemplatesPage() {
  const me = useAuth.user;

  const isSuperadmin = useMemo(
    () => (me?.roles ?? []).includes('Superadmin'),
    [me?.roles]
  );

  const branchIdFromAuth =
    typeof me?.branch_id === 'string' ? me.branch_id : null;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [branches, setBranches] = useState<BranchOption[]>([]);

  const [pending, setPending] = useState<FormState>({
    branch_id: isSuperadmin ? null : branchIdFromAuth,
    key: 'receipt_pending',
    name: 'Receipt Pending',
    content: DEFAULT_PENDING,
    is_active: true,
  });

  const [paid, setPaid] = useState<FormState>({
    branch_id: isSuperadmin ? null : branchIdFromAuth,
    key: 'receipt_paid',
    name: 'Receipt Paid',
    content: DEFAULT_PAID,
    is_active: true,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (isSuperadmin) {
        const br = await listBranches({ per_page: 100 });
        const mappedBranches: BranchOption[] = (br.data ?? []).map((branch) => ({
          id: branch.id,
          name: branch.name,
        }));
        setBranches(mappedBranches);
      } else {
        setBranches([]);
      }

      const res = await listWhatsappTemplates({ per_page: 100 });
      const items = res.data ?? [];

      const rowPending = items.find((item) => item.key === 'receipt_pending');
      const rowPaid = items.find((item) => item.key === 'receipt_paid');

      if (rowPending) {
        setPending({
          id: rowPending.id,
          branch_id: rowPending.branch_id,
          key: rowPending.key,
          name: rowPending.name,
          content: rowPending.content,
          is_active: rowPending.is_active,
        });
      } else {
        setPending({
          branch_id: isSuperadmin ? null : branchIdFromAuth,
          key: 'receipt_pending',
          name: 'Receipt Pending',
          content: DEFAULT_PENDING,
          is_active: true,
        });
      }

      if (rowPaid) {
        setPaid({
          id: rowPaid.id,
          branch_id: rowPaid.branch_id,
          key: rowPaid.key,
          name: rowPaid.name,
          content: rowPaid.content,
          is_active: rowPaid.is_active,
        });
      } else {
        setPaid({
          branch_id: isSuperadmin ? null : branchIdFromAuth,
          key: 'receipt_paid',
          name: 'Receipt Paid',
          content: DEFAULT_PAID,
          is_active: true,
        });
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Gagal memuat template WhatsApp.'));
    } finally {
      setLoading(false);
    }
  }, [branchIdFromAuth, isSuperadmin]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function saveOne(form: FormState): Promise<void> {
    setSaving(true);
    setError(null);

    try {
      const payload = {
        branch_id: form.branch_id,
        key: form.key,
        name: form.name,
        content: form.content,
        is_active: form.is_active,
      };

      if (form.id) {
        await updateWhatsappTemplate(form.id, payload);
      } else {
        await createWhatsappTemplate(payload);
      }

      await loadData();
      window.alert(`Template ${form.key} berhasil disimpan.`);
    } catch (err: unknown) {
      setError(getErrorMessage(err, `Gagal menyimpan template ${form.key}.`));
    } finally {
      setSaving(false);
    }
  }

  const helpPlaceholders = [
    '{{customer_name}}',
    '{{invoice_no}}',
    '{{order_no}}',
    '{{grand_total}}',
    '{{payment_status}}',
    '{{share_url}}',
    '{{app_name}}',
  ];

  return (
    <div className="space-y-4">
      <header>
        <div className="text-xs text-slate-500">Settings / WhatsApp Templates</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          WhatsApp Templates
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola template pesan WhatsApp untuk receipt pending dan receipt paid.
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
          Memuat…
        </div>
      ) : (
        <>
          <TemplateCard
            title="Receipt Pending"
            form={pending}
            setForm={setPending}
            onSave={() => {
              void saveOne(pending);
            }}
            saving={saving}
            branches={branches}
            isSuperadmin={isSuperadmin}
            helpPlaceholders={helpPlaceholders}
          />

          <TemplateCard
            title="Receipt Paid"
            form={paid}
            setForm={setPaid}
            onSave={() => {
              void saveOne(paid);
            }}
            saving={saving}
            branches={branches}
            isSuperadmin={isSuperadmin}
            helpPlaceholders={helpPlaceholders}
          />
        </>
      )}
    </div>
  );
}

function TemplateCard({
  title,
  form,
  setForm,
  onSave,
  saving,
  branches,
  isSuperadmin,
  helpPlaceholders,
}: TemplateCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-[0_14px_40px_-30px_rgba(0,0,0,.35)]">
      <div className="border-b border-slate-200 px-4 py-3 sm:px-6">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>

      <div className="space-y-4 px-4 py-4 sm:px-6">
        {isSuperadmin && (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Scope
            </label>
            <select
              className="input w-full"
              value={form.branch_id ?? ''}
              onChange={(e) => {
                const value = e.target.value || null;
                setForm((prev) => ({ ...prev, branch_id: value }));
              }}
            >
              <option value="">Global</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Nama Template
          </label>
          <input
            className="input w-full"
            value={form.name}
            onChange={(e) => {
              const value = e.target.value;
              setForm((prev) => ({ ...prev, name: value }));
            }}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Isi Template
          </label>
          <textarea
            className="input min-h-[220px] w-full"
            value={form.content}
            onChange={(e) => {
              const value = e.target.value;
              setForm((prev) => ({ ...prev, content: value }));
            }}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => {
              const checked = e.target.checked;
              setForm((prev) => ({ ...prev, is_active: checked }));
            }}
          />
          Aktif
        </label>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <div className="font-semibold text-slate-700">
            Placeholder yang bisa dipakai:
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {helpPlaceholders.map((placeholder) => (
              <code
                key={placeholder}
                className="rounded bg-white px-2 py-1 text-[11px]"
              >
                {placeholder}
              </code>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            onClick={onSave}
            disabled={saving}
          >
            Simpan
          </button>
        </div>
      </div>
    </section>
  );
}