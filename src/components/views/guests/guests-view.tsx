"use client";

import { AddGuestModal } from "@/components/features/guests/add-guest-modal";
import { GuestHistoryModal } from "@/components/features/guests/guest-history-modal";
import { useGuests } from "./hooks/use-guests";
import { useGuestHistory } from "./hooks/use-guest-history";
import { GuestsStatsBar } from "./components/guests-stats-bar";
import { GuestsToolbar } from "./components/guests-toolbar";
import { GuestsTable } from "./components/guests-table";
import { GroupsModal, ConfigModal } from "./components/groups-modal";

export default function InvitadosPage() {
  const g = useGuests();
  const h = useGuestHistory();

  return (
    <div className="max-w-[1300px] mx-auto">
      <GuestsStatsBar stats={g.stats} />

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
        showQuickAdd={g.showQuickAdd} setShowQuickAdd={g.setShowQuickAdd}
        quickName={g.quickName} setQuickName={g.setQuickName}
        quickGroupId={g.quickGroupId} setQuickGroupId={g.setQuickGroupId}
        quickSaving={g.quickSaving} handleQuickAdd={g.handleQuickAdd}
        quickAddRef={g.quickAddRef}
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
        mealOptions={g.mealOptions} allergyOptions={g.allergyOptions} transportPoints={g.transportPoints}
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
