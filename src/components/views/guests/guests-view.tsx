"use client";

import { Send, Loader2 } from "lucide-react";
import { AddGuestModal } from "./components/modals/add-guest-modal";
import { GuestHistoryModal } from "./components/modals/guest-history-modal";
import { useGuests } from "./hooks/use-guests";
import { useGuestHistory } from "./hooks/use-guest-history";
import { GuestsStatsBar } from "./components/stats-bar";
import { GuestsToolbar } from "./components/toolbar";
import { GuestsTable } from "./components/table/table";
import { GroupsModal, ConfigModal } from "./components/modals/groups-modal";

export default function InvitadosPage() {
  const g = useGuests();
  const h = useGuestHistory();

  return (
    <div className="max-w-[1300px] mx-auto">
      <GuestsStatsBar stats={g.stats} />

      {g.inviteToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-text text-white text-[13px] px-5 py-3 rounded-full shadow-lg">
          {g.inviteToast}
        </div>
      )}

      {g.selectedIds.size > 0 && (
        <div className="flex items-center gap-3 mb-3 px-4 py-2.5 bg-[#f5efe9] border border-cta/30 rounded-xl">
          <span className="text-[13px] text-accent font-medium">{g.selectedIds.size} invitado{g.selectedIds.size > 1 ? "s" : ""} seleccionado{g.selectedIds.size > 1 ? "s" : ""}</span>
          <button onClick={g.handleBulkInvite} disabled={g.bulkSending}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-cta hover:bg-[#b08f5d] text-white text-[13px] font-semibold transition-colors disabled:opacity-60">
            {g.bulkSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            Enviar invitación
          </button>
          <button onClick={g.clearSelect} className="text-[12px] text-brand hover:underline ml-auto">Cancelar</button>
        </div>
      )}

      <GuestsToolbar
        groups={g.groups}
        setShowAddModal={g.setShowAddModal}
        setShowGroupsModal={g.setShowGroupsModal}
        setShowConfigModal={g.setShowConfigModal}
        searchQuery={g.searchQuery} setSearchQuery={g.setSearchQuery}
        rsvpFilter={g.rsvpFilter} setRsvpFilter={g.setRsvpFilter}
        groupFilter={g.groupFilter} setGroupFilter={g.setGroupFilter}
        showColMenu={g.showColMenu} setShowColMenu={g.setShowColMenu}
        show={g.show} toggleCol={g.toggleCol} colMenuRef={g.colMenuRef}
        excelInputRef={g.excelInputRef}
        importingExcel={g.importingExcel} importError={g.importError}
        setImportError={g.setImportError} handleExcelFile={g.handleExcelFile}
        onExportExcel={g.handleExportExcel}
      />

      <GuestsTable
        filteredGuests={g.filteredGuests} groups={g.groups} groupMap={g.groupMap}
        mealOptions={g.mealOptions} allergyOptions={g.allergyOptions} transportPoints={g.transportPoints}
        show={g.show}
        isEditing={g.isEditing} editValue={g.editValue} setEditValue={g.setEditValue}
        startEdit={g.startEdit} cancelEdit={g.cancelEdit} saveEdit={g.saveEdit}
        handleKeyDown={g.handleKeyDown}
        deletingId={g.deletingId} setDeletingId={g.setDeletingId}
        handleDelete={g.handleDelete} handleAssignGroup={g.handleAssignGroup}
        onHistoryClick={h.openHistory}
        getFirst={g.getFirst} getLast={g.getLast} loadData={g.loadData}
        searchQuery={g.searchQuery} rsvpFilter={g.rsvpFilter} groupFilter={g.groupFilter}
        selectedIds={g.selectedIds} onSelectAll={g.selectAll} onClearSelect={g.clearSelect}
        onToggleSelect={g.toggleSelectGuest}
        onSendInvite={g.handleSendInvite} sendingInvite={g.sendingInvite}
      />

      <AddGuestModal
        open={g.showAddModal} onClose={() => g.setShowAddModal(false)}
        onAdd={g.handleAddGuest} onGroupCreated={g.loadGroups} groups={g.groups} mealOptions={g.mealOptions}
        allergyOptions={g.allergyOptions} transportPoints={g.transportPoints}
      />

      <GroupsModal
        open={g.showGroupsModal} onClose={() => g.setShowGroupsModal(false)}
        groups={g.groups} guests={g.guests}
        newGroupName={g.newGroupName} setNewGroupName={g.setNewGroupName}
        deletingGroupId={g.deletingGroupId} setDeletingGroupId={g.setDeletingGroupId}
        handleCreateGroup={g.handleCreateGroup} handleDeleteGroup={g.handleDeleteGroup}
        handleRenameGroup={g.handleRenameGroup}
      />

      <ConfigModal
        open={g.showConfigModal} onClose={() => g.setShowConfigModal(false)}
        mealOptions={g.mealOptions} mealColors={g.mealColors} allergyOptions={g.allergyOptions} allergyColors={g.allergyColors} transportPoints={g.transportPoints}
        onSave={g.handleSaveConfig}
      />

      <GuestHistoryModal
        open={h.open} onClose={h.closeHistory}
        history={h.history} loading={h.loading}
        sortedLog={h.sortedLog} overriddenFields={h.overriddenFields}
      />
    </div>
  );
}
