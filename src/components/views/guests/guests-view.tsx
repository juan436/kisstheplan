"use client";

import { AddGuestModal } from "@/components/features/guests/add-guest-modal";
import { useGuests } from "./hooks/use-guests";
import { GuestsStatsBar } from "./components/guests-stats-bar";
import { GuestsToolbar } from "./components/guests-toolbar";
import { GuestsTable } from "./components/guests-table";
import { GroupsModal, ConfigModal } from "./components/groups-modal";

export default function InvitadosPage() {
  const g = useGuests();

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
      />

      <GuestsTable
        filteredGuests={g.filteredGuests} groups={g.groups} groupMap={g.groupMap}
        mealOptions={g.mealOptions} show={g.show}
        isEditing={g.isEditing} editValue={g.editValue} setEditValue={g.setEditValue}
        startEdit={g.startEdit} cancelEdit={g.cancelEdit} saveEdit={g.saveEdit}
        handleKeyDown={g.handleKeyDown}
        deletingId={g.deletingId} setDeletingId={g.setDeletingId}
        handleDelete={g.handleDelete} handleAssignGroup={g.handleAssignGroup}
        getFirst={g.getFirst} getLast={g.getLast} loadData={g.loadData}
        searchQuery={g.searchQuery} rsvpFilter={g.rsvpFilter} groupFilter={g.groupFilter}
      />

      <AddGuestModal
        open={g.showAddModal} onClose={() => g.setShowAddModal(false)}
        onAdd={g.handleAddGuest} groups={g.groups} mealOptions={g.mealOptions}
      />

      <GroupsModal
        open={g.showGroupsModal} onClose={() => g.setShowGroupsModal(false)}
        groups={g.groups} guests={g.guests}
        newGroupName={g.newGroupName} setNewGroupName={g.setNewGroupName}
        deletingGroupId={g.deletingGroupId} setDeletingGroupId={g.setDeletingGroupId}
        handleCreateGroup={g.handleCreateGroup} handleDeleteGroup={g.handleDeleteGroup}
      />

      <ConfigModal
        open={g.showConfigModal} onClose={() => g.setShowConfigModal(false)}
        mealOptions={g.mealOptions} allergyOptions={g.allergyOptions} transportPoints={g.transportPoints}
        onSaveMeals={g.setMealOptions} onSaveAllergies={g.setAllergyOptions} onSaveTransport={g.setTransportPoints}
      />
    </div>
  );
}
