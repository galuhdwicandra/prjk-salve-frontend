export interface Props {
    open: boolean;
    title: string;
    message?: string;
    onConfirm(): void;
    onClose(): void;
}
export default function ConfirmDialog(props: Props) {
    void props; // mark as used agar lolos no-unused-vars
    return null;
}