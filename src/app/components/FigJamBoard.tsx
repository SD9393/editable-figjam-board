import { useState, useEffect, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, Plus, X, Edit2, Check, Users, Calendar, Trash2, Mail, Bell, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from '@/config/firebase';
import { ref, set, onValue, update } from 'firebase/database';

interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

interface ProjectCard {
  id: string;
  lineNumber: number;
  priority: string;
  projectName: string;
  subtasks: Subtask[];
  owner: string;
  ownerTags?: string[]; // Owner as tags
  status: 'inProgress' | 'done' | 'todo' | 'onHold';
  deliverableDate: string;
  notes: string;
  category?: string; // For custom rows
  tags?: string[]; // Tagged teammates
  lastModifiedBy?: string; // Who made the last change
  lastModifiedAt?: number; // Timestamp of last change
}

interface CustomRow {
  id: string;
  name: string;
  color: string;
}

interface Teammate {
  id: string;
  name: string;
  color: string;
  email?: string;
}

const initialProjects: ProjectCard[] = [
  // P0 Projects
  {
    id: '1',
    lineNumber: 1,
    priority: 'P0',
    projectName: 'Seeded topics - Bias',
    subtasks: [
      { id: '1-1', text: 'Ideate and write prompts', completed: false },
      { id: '1-2', text: "Samrat's feedback", completed: false },
      { id: '1-3', text: 'Draft of all topics for bias', completed: false },
      { id: '1-4', text: 'Palak Testing', completed: false },
      { id: '1-5', text: 'Deliver Age and Gender Bias', completed: false },
      { id: '1-6', text: 'Assess if the other biases for future release or discard', completed: true },
    ],
    owner: 'Edosa/Palak',
    ownerTags: ['1', '2'], // Edosa, Palak
    status: 'inProgress',
    deliverableDate: '2026-01-31',
    notes: 'hand off end of Jan',
  },
  {
    id: '2',
    lineNumber: 2,
    priority: 'P0',
    projectName: 'VT - Seeded topic',
    subtasks: [
      { id: '2-1', text: 'Align prompt to Text guidelines', completed: false },
      { id: '2-2', text: 'Studio Implementation', completed: false },
      { id: '2-3', text: 'Samrat & Gowri Review', completed: true },
      { id: '2-4', text: 'Palak testing', completed: true },
      { id: '2-5', text: 'Test Plan Review', completed: true },
      { id: '2-6', text: 'Hand off to April', completed: true },
    ],
    owner: 'Samrat/Surya/Palak',
    ownerTags: ['3', '4', '2'], // Samrat, Surya, Palak
    status: 'inProgress',
    deliverableDate: '------',
    notes: 'Partnering with Fusion AI',
  },
  {
    id: '6',
    lineNumber: 6,
    priority: 'P0',
    projectName: 'Redwood VT Metric',
    subtasks: [
      { id: '6-1', text: 'Completed assembling the LLM as a judge evaluation step', completed: true },
      { id: '6-2', text: 'Setting up baseline', completed: true },
      { id: '6-3', text: '-', completed: true },
    ],
    owner: 'Sid',
    ownerTags: ['5'], // Sid
    status: 'inProgress',
    deliverableDate: '------',
    notes: '--',
  },
  // P1 Projects
  {
    id: '3',
    lineNumber: 3,
    priority: 'P1',
    projectName: 'Seeded topic - Correct form factor',
    subtasks: [
      { id: '3-1', text: 'Finalize list of form factors not covered by RDS', completed: true },
      { id: '3-2', text: 'Draft 1 output formatting', completed: true },
      { id: '3-3', text: 'Palak Testing', completed: true },
    ],
    owner: 'Edosa/Palak',
    ownerTags: ['1', '2'], // Edosa, Palak
    status: 'inProgress',
    deliverableDate: '------',
    notes: 'Partnering with Fusion AI, RDS and ODE',
  },
  {
    id: '7',
    lineNumber: 7,
    priority: 'P1',
    projectName: 'Automate the test-cases via metro',
    subtasks: [
      { id: '7-1', text: 'Have an environment to execute test-cases', completed: true },
      { id: '7-2', text: 'Create test-case execution automation', completed: true },
      { id: '7-3', text: 'Have metric to check quality', completed: false },
    ],
    owner: 'Palak',
    ownerTags: ['2'], // Palak
    status: 'inProgress',
    deliverableDate: '------',
    notes: '------',
  },
  {
    id: '8',
    lineNumber: 8,
    priority: 'P1',
    projectName: 'GenAI status messages',
    subtasks: [
      { id: '8-1', text: 'Await for feedback from Samrat', completed: true },
      { id: '8-2', text: 'Make edit/changes for presentation to Ashok + company', completed: true },
      { id: '8-3', text: 'Analyse logs to segment status messages', completed: true },
      { id: '8-4', text: 'Await feedback from Samrat', completed: false },
      { id: '8-5', text: 'Reduce inference time to sub 12s responses', completed: false },
      { id: '8-6', text: 'Detailed documentation of time delta', completed: false },
    ],
    owner: 'Surya',
    ownerTags: ['4'], // Surya
    status: 'inProgress',
    deliverableDate: '------',
    notes: '--',
  },
  {
    id: '9',
    lineNumber: 9,
    priority: 'P1',
    projectName: 'VT - Strict',
    subtasks: [
      { id: '9-1', text: 'Draft prompt', completed: false },
      { id: '9-2', text: 'Testing internally', completed: false },
    ],
    owner: 'TBD',
    ownerTags: ['8'], // TBD
    status: 'todo',
    deliverableDate: '—',
    notes: '—',
  },
  {
    id: '10',
    lineNumber: 10,
    priority: 'P1',
    projectName: 'VT - Verify',
    subtasks: [
      { id: '10-1', text: 'Draft prompt', completed: false },
      { id: '10-2', text: 'Testing internally', completed: false },
      { id: '10-3', text: 'Draft implementation plan with partners for research', completed: false },
    ],
    owner: 'TBD',
    ownerTags: ['8'], // TBD
    status: 'todo',
    deliverableDate: 'TBD',
    notes: '—',
  },
  {
    id: '11',
    lineNumber: 11,
    priority: 'P1',
    projectName: 'Seeded X Filters',
    subtasks: [
      { id: '11-1', text: 'FYI: Dev complete on Fusion/AI for content moderation', completed: false },
      { id: '11-2', text: 'Add moderation call', completed: false },
    ],
    owner: 'TBD',
    ownerTags: ['8'], // TBD
    status: 'todo',
    deliverableDate: '—',
    notes: '—',
  },
  // P2 Projects
  {
    id: '12',
    lineNumber: 12,
    priority: 'P2',
    projectName: 'MagicPrompt',
    subtasks: [
      { id: '12-1', text: 'Draft the product plan', completed: true },
      { id: '12-2', text: 'PRFAQ', completed: false },
      { id: '12-3', text: 'Feasibility analysis', completed: false },
    ],
    owner: 'Gowri/Palak',
    ownerTags: ['6', '2'], // Gowri, Palak
    status: 'inProgress',
    deliverableDate: '------',
    notes: 'Review with Samrat',
  },
  {
    id: '13',
    lineNumber: 13,
    priority: 'P2',
    projectName: 'QA Testing',
    subtasks: [
      { id: '13-1', text: 'Test case generation', completed: false },
      { id: '13-2', text: 'Execute test cases', completed: false },
      { id: '13-3', text: 'Report generation', completed: false },
    ],
    owner: 'Palak',
    ownerTags: ['2'], // Palak
    status: 'todo',
    deliverableDate: 'TBD',
    notes: '—',
  },
  // P3 Projects
  {
    id: '4',
    lineNumber: 4,
    priority: 'P3',
    projectName: 'ROC - Metric',
    subtasks: [
      { id: '4-1', text: 'First draft', completed: true },
      { id: '4-2', text: "Samrat's Review", completed: false },
      { id: '4-3', text: 'work on feedback', completed: true },
    ],
    owner: 'Sid',
    ownerTags: ['5'], // Sid
    status: 'inProgress',
    deliverableDate: '------',
    notes: '-- ------',
  },
  {
    id: '5',
    lineNumber: 5,
    priority: 'P3',
    projectName: 'ROC - Testing',
    subtasks: [
      { id: '5-1', text: 'First Draft', completed: true },
      { id: '5-2', text: 'Samrat Review', completed: false },
      { id: '5-3', text: "Implement Gowri and Sweta's comments", completed: true },
      { id: '5-4', text: "Work on Samrat's feedback", completed: true },
    ],
    owner: 'Palak',
    ownerTags: ['2'], // Palak
    status: 'inProgress',
    deliverableDate: '------',
    notes: '--',
  },
  {
    id: '14',
    lineNumber: 14,
    priority: 'P3',
    projectName: 'Research - Future Models',
    subtasks: [
      { id: '14-1', text: 'Research new model architectures', completed: false },
      { id: '14-2', text: 'Document findings', completed: false },
    ],
    owner: 'Sid',
    ownerTags: ['5'], // Sid
    status: 'todo',
    deliverableDate: 'TBD',
    notes: 'Long term research',
  },
  // P4 Projects
  {
    id: '15',
    lineNumber: 15,
    priority: 'P4',
    projectName: 'Documentation Updates',
    subtasks: [
      { id: '15-1', text: 'Update API documentation', completed: false },
      { id: '15-2', text: 'Create user guides', completed: false },
    ],
    owner: 'TBD',
    ownerTags: ['8'], // TBD
    status: 'todo',
    deliverableDate: 'TBD',
    notes: 'Nice to have',
  },
  // Custom Category - Planned
  {
    id: '16',
    lineNumber: 16,
    priority: 'Planned',
    projectName: 'Mobile App Integration',
    subtasks: [
      { id: '16-1', text: 'Define requirements', completed: false },
      { id: '16-2', text: 'Create mockups', completed: false },
    ],
    owner: 'Design Team',
    status: 'todo',
    deliverableDate: 'Q2 2026',
    notes: 'Pending approval',
    category: 'Planned',
  },
  {
    id: '17',
    lineNumber: 17,
    priority: 'Planned',
    projectName: 'Analytics Dashboard',
    subtasks: [
      { id: '17-1', text: 'Gather metrics requirements', completed: false },
      { id: '17-2', text: 'Design dashboard layout', completed: false },
    ],
    owner: 'Analytics Team',
    status: 'todo',
    deliverableDate: 'Q2 2026',
    notes: 'Future roadmap',
    category: 'Planned',
  },
  // Custom Category - In Discussions
  {
    id: '18',
    lineNumber: 18,
    priority: 'In Discussions',
    projectName: 'Performance Optimization',
    subtasks: [
      { id: '18-1', text: 'Identify bottlenecks', completed: true },
      { id: '18-2', text: 'Discuss with engineering team', completed: false },
    ],
    owner: 'Samrat/Sid',
    ownerTags: ['3', '5'], // Samrat, Sid
    status: 'inProgress',
    deliverableDate: 'TBD',
    notes: 'Awaiting stakeholder input',
    category: 'In Discussions',
  },
  // Custom Category - Backlog
  {
    id: '19',
    lineNumber: 19,
    priority: 'Backlog',
    projectName: 'Feature X Enhancement',
    subtasks: [
      { id: '19-1', text: 'Collect user feedback', completed: false },
    ],
    owner: 'Product',
    status: 'todo',
    deliverableDate: 'TBD',
    notes: 'Low priority enhancement',
    category: 'Backlog',
  },
];

const initialCustomRows: CustomRow[] = [
  { id: 'planned', name: 'Planned', color: 'bg-purple-50 border-purple-200' },
  { id: 'discussions', name: 'In Discussions', color: 'bg-teal-50 border-teal-200' },
  { id: 'backlog', name: 'Backlog', color: 'bg-slate-50 border-slate-200' },
];

const initialTeammates: Teammate[] = [
  { id: '1', name: 'Edosa', color: 'bg-blue-500', email: 'edosa.leta@oracle.com' },
  { id: '2', name: 'Palak', color: 'bg-green-500', email: 'palak.jalota@oracle.com' },
  { id: '3', name: 'Samrat', color: 'bg-red-500', email: 'samrat.baul@oracle.com' },
  { id: '4', name: 'Surya', color: 'bg-yellow-500', email: 'Surya.deepak@oracle.com' },
  { id: '5', name: 'Sid', color: 'bg-indigo-500', email: 'siddharth.andra@oracle.com' },
  { id: '6', name: 'Gowri', color: 'bg-pink-500' },
  { id: '7', name: 'April', color: 'bg-orange-500' },
  { id: '8', name: 'TBD', color: 'bg-gray-500' },
  { id: '9', name: 'Samriddho', color: 'bg-purple-500', email: 'samriddho.ghosh@oracle.com' },
];

const teammateColors = [
  'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500',
  'bg-indigo-500', 'bg-pink-500', 'bg-orange-500', 'bg-purple-500',
  'bg-teal-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500'
];

function SidebarProjectItem({ 
  project, 
  onDrop, 
  onClick, 
  isHighlighted 
}: { 
  project: ProjectCard; 
  onDrop: (draggedId: string, targetId: string) => void;
  onClick: () => void;
  isHighlighted: boolean;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'sidebar-project',
    item: { id: project.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'sidebar-project',
    drop: (item: { id: string }) => {
      if (item.id !== project.id) {
        onDrop(item.id, project.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const priorityColorMap: Record<string, string> = {
    P0: 'bg-red-500',
    P1: 'bg-orange-500',
    P2: 'bg-blue-500',
    P3: 'bg-gray-500',
    P4: 'bg-slate-500',
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      onClick={onClick}
      className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${
        isDragging ? 'opacity-50' : ''
      } ${
        isOver ? 'border-t-2 border-blue-500' : ''
      } ${
        isHighlighted ? 'bg-yellow-100 ring-2 ring-yellow-400' : 'hover:bg-gray-100'
      }`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <div 
        className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityColorMap[project.priority] || 'bg-purple-500'}`}
      />
      <span className="text-xs font-semibold text-gray-500 flex-shrink-0 w-6">
        {getPriorityInitials(project.priority)}
      </span>
      <span className="text-sm truncate flex-1">
        {project.projectName}
      </span>
    </div>
  );
}

function PriorityRow({ 
  priority, 
  isCustom, 
  projects, 
  onDrop, 
  children 
}: { 
  priority: string; 
  isCustom: boolean; 
  projects: ProjectCard[]; 
  onDrop: (cardId: string, newPriority: string, isCustom: boolean) => void;
  children: React.ReactNode;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['card', 'sidebar-project'],
    drop: (item: { id: string }) => {
      onDrop(item.id, priority, isCustom);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div 
      ref={drop}
      className={`transition-all ${isOver ? 'ring-4 ring-blue-400 ring-opacity-50' : ''}`}
    >
      {children}
    </div>
  );
}

function EditableCard({ 
  project, 
  onUpdate, 
  onDelete,
  laneIndex,
  indexInLane,
  teammates,
  onShowOwnerModal,
  onShowTagModal,
  cardRef,
  isHighlighted
}: { 
  project: ProjectCard; 
  onUpdate: (id: string, updates: Partial<ProjectCard>) => void;
  onDelete: (id: string) => void;
  laneIndex: number;
  indexInLane: number;
  teammates: Teammate[];
  onShowOwnerModal: (projectId: string) => void;
  onShowTagModal: (projectId: string) => void;
  cardRef?: React.RefObject<HTMLDivElement>;
  isHighlighted?: boolean;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { id: project.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Ensure arrays always exist (Firebase might not have them if they were empty)
  const subtasks = project.subtasks || [];
  const ownerTags = project.ownerTags || [];
  const tags = project.tags || [];

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    onUpdate(project.id, { subtasks: updatedSubtasks });
  };

  const handleAddSubtask = () => {
    const newSubtask: Subtask = {
      id: `${project.id}-${Date.now()}`,
      text: 'New subtask',
      completed: false,
    };
    onUpdate(project.id, { subtasks: [...subtasks, newSubtask] });
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = subtasks.filter(st => st.id !== subtaskId);
    onUpdate(project.id, { subtasks: updatedSubtasks });
  };

  const handleStatusChange = () => {
    const statusMap = { todo: 'inProgress', inProgress: 'done', done: 'onHold', onHold: 'todo' } as const;
    onUpdate(project.id, { status: statusMap[project.status] });
  };

  const statusColors = {
    inProgress: 'bg-[#eb9632]',
    done: 'bg-[#6FA939]',
    todo: 'bg-gray-400',
    onHold: 'bg-purple-500',
  };

  const statusLabels = {
    inProgress: 'In progress',
    done: 'Done',
    todo: 'To do',
    onHold: 'On hold',
  };

  const priorityColors: Record<string, string> = {
    P0: 'bg-red-100 text-red-700 border-red-300',
    P1: 'bg-orange-100 text-orange-700 border-orange-300',
    P2: 'bg-blue-100 text-blue-700 border-blue-300',
    P3: 'bg-gray-100 text-gray-700 border-gray-300',
    P4: 'bg-slate-100 text-slate-700 border-slate-300',
    Planned: 'bg-purple-100 text-purple-700 border-purple-300',
    'In Discussions': 'bg-teal-100 text-teal-700 border-teal-300',
    Backlog: 'bg-slate-100 text-slate-600 border-slate-300',
  };

  return (
    <div
      ref={(node) => {
        drag(node);
        if (cardRef) {
          (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
      className={`bg-white rounded-lg shadow-md p-5 border-2 hover:shadow-lg transition-all ${
        isHighlighted ? 'border-yellow-400 ring-4 ring-yellow-300 ring-opacity-50' : 'border-gray-200'
      }`}
    >
      {/* Header with drag handle and delete button */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GripVertical className="text-gray-400 w-5 h-5" />
          <span className="font-bold text-base">{project.lineNumber}.</span>
          <span 
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border-2 ${priorityColors[project.priority] || 'bg-gray-100 text-gray-700 border-gray-300'}`}
          >
            {project.priority}
          </span>
        </div>
        <button
          onClick={() => onDelete(project.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Project Name */}
      <input
        type="text"
        value={project.projectName}
        onChange={(e) => onUpdate(project.id, { projectName: e.target.value })}
        className="w-full text-lg font-bold mb-3 border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-1"
      />

      {/* Subtasks */}
      <div className="space-y-1.5 mb-4">
        {subtasks.map((subtask) => (
          <div key={subtask.id} className="flex items-start gap-2 group">
            <input
              type="checkbox"
              checked={subtask.completed}
              onChange={() => handleToggleSubtask(subtask.id)}
              className="mt-1 w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <input
              type="text"
              value={subtask.text}
              onChange={(e) => {
                const updatedSubtasks = subtasks.map(st =>
                  st.id === subtask.id ? { ...st, text: e.target.value } : st
                );
                onUpdate(project.id, { subtasks: updatedSubtasks });
              }}
              className={`flex-1 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 text-xs ${
                subtask.completed ? 'line-through text-gray-400' : ''
              }`}
            />
            <button
              onClick={() => handleDeleteSubtask(subtask.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          onClick={handleAddSubtask}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors mt-1"
        >
          <Plus className="w-3 h-3" />
          Add subtask
        </button>
      </div>

      {/* Owner Tags */}
      <div className="mb-2">
        <label className="text-[10px] text-gray-500 uppercase tracking-wide">Owner</label>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {ownerTags.map(ownerId => {
            const teammate = teammates.find(t => t.id === ownerId);
            return teammate ? (
              <div key={ownerId} className={`px-2 py-1 rounded-full text-xs font-bold ${teammate.color} text-white flex items-center gap-1`}>
                {teammate.name}
              </div>
            ) : null;
          })}
          <button
            onClick={() => onShowOwnerModal(project.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Users className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="mb-2">
        <label className="text-[10px] text-gray-500 uppercase tracking-wide block mb-1">Status</label>
        <button
          onClick={handleStatusChange}
          className={`${statusColors[project.status]} text-white px-3 py-1 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity`}
        >
          {statusLabels[project.status]}
        </button>
      </div>

      {/* Deliverable Date with Calendar */}
      <div className="mb-2">
        <label className="text-[10px] text-gray-500 uppercase tracking-wide">Deliverable Date</label>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={sanitizeDateForInput(project.deliverableDate)}
            onChange={(e) => onUpdate(project.id, { deliverableDate: e.target.value || '—' })}
            className="flex-1 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 text-xs"
          />
          <Calendar className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Notes */}
      <div className="mb-2">
        <label className="text-[10px] text-gray-500 uppercase tracking-wide">Notes</label>
        <textarea
          value={project.notes}
          onChange={(e) => onUpdate(project.id, { notes: e.target.value })}
          className="w-full border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 text-xs resize-none"
          rows={1}
        />
      </div>

      {/* Tagged Teammates */}
      <div className="mt-2">
        <label className="text-[10px] text-gray-500 uppercase tracking-wide">Tagged Teammates</label>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {tags.map(tagId => {
            const teammate = teammates.find(t => t.id === tagId);
            return teammate ? (
              <div key={tagId} className={`px-2 py-1 rounded-full text-xs font-bold ${teammate.color} text-white`}>
                {teammate.name}
              </div>
            ) : null;
          })}
          <button
            onClick={() => onShowTagModal(project.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Users className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Last Modified Info */}
      {project.lastModifiedBy && project.lastModifiedAt && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-[10px] text-gray-400 italic">
            Last edited by <span className="font-semibold text-gray-600">{project.lastModifiedBy}</span>
            {' • '}
            {new Date(project.lastModifiedAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to remove undefined values from objects (Firebase doesn't allow undefined)
function cleanFirebaseData<T>(data: T): T {
  if (Array.isArray(data)) {
    return data.map(item => cleanFirebaseData(item)) as T;
  } else if (data !== null && typeof data === 'object') {
    const cleaned: any = {};
    Object.keys(data).forEach(key => {
      const value = (data as any)[key];
      if (value !== undefined) {
        cleaned[key] = cleanFirebaseData(value);
      }
    });
    return cleaned as T;
  }
  return data;
}

// Helper function to sanitize date values for HTML date input
function sanitizeDateForInput(dateValue: string): string {
  // If it's a valid YYYY-MM-DD format, return it
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }
  // Otherwise return empty string (don't allow "TBD", "------", "—", etc.)
  return '';
}

// Helper function to convert priority names to initials for sidebar display
function getPriorityInitials(priority: string): string {
  // For standard priorities (P0-P4), return as is
  if (/^P\d$/.test(priority)) {
    return priority;
  }
  
  // For custom priorities, convert to initials
  const words = priority.split(' ');
  if (words.length === 1) {
    // Single word: take first letter (e.g., "Planned" → "P", "Backlog" → "B")
    return priority.charAt(0).toUpperCase();
  } else {
    // Multiple words: take first letter of each word (e.g., "In Discussions" → "ID")
    return words.map(word => word.charAt(0).toUpperCase()).join('');
  }
}

export default function FigJamBoard() {
  const [projects, setProjects] = useState<ProjectCard[]>(initialProjects);
  const [customRows, setCustomRows] = useState<CustomRow[]>(initialCustomRows);
  const [teammates, setTeammates] = useState<Teammate[]>(initialTeammates);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingRowName, setEditingRowName] = useState('');
  const [showTeammatesManagementModal, setShowTeammatesManagementModal] = useState(false);
  const [showOwnerModal, setShowOwnerModal] = useState<string | null>(null);
  const [showTagModal, setShowTagModal] = useState<string | null>(null);
  const [newTeammateName, setNewTeammateName] = useState('');
  const [editingTeammateId, setEditingTeammateId] = useState<string | null>(null);
  const [editingTeammateName, setEditingTeammateName] = useState('');
  const [editingTeammateEmail, setEditingTeammateEmail] = useState('');
  const [showNotificationInfo, setShowNotificationInfo] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [showUserPrompt, setShowUserPrompt] = useState(false);
  const [userNameInput, setUserNameInput] = useState('');
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [highlightedProjectId, setHighlightedProjectId] = useState<string | null>(null);
  
  // Create refs for all project cards
  const projectRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({});

  // Initialize user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('figJamUserName');
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsFirebaseReady(true);
    } else {
      setShowUserPrompt(true);
    }
  }, []);

  // Set up Firebase real-time listeners
  useEffect(() => {
    if (!isFirebaseReady) return;
    
    // If Firebase is not configured, initialize with local state + localStorage
    if (!db) {
      console.log('Firebase not configured - using local state with localStorage');
      
      // Try to load from localStorage first
      try {
        const savedProjects = localStorage.getItem('projects');
        const savedCustomRows = localStorage.getItem('customRows');
        const savedTeammates = localStorage.getItem('teammates');
        
        setProjects(savedProjects ? JSON.parse(savedProjects) : initialProjects);
        setCustomRows(savedCustomRows ? JSON.parse(savedCustomRows) : initialCustomRows);
        setTeammates(savedTeammates ? JSON.parse(savedTeammates) : initialTeammates);
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        setProjects(initialProjects);
        setCustomRows(initialCustomRows);
        setTeammates(initialTeammates);
      }
      return;
    }

    const projectsRef = ref(db, 'projects');
    const customRowsRef = ref(db, 'customRows');
    const teammatesRef = ref(db, 'teammates');

    // Listen for projects changes
    const unsubscribeProjects = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      // Safe array guard: only set if data is a valid array
      if (Array.isArray(data)) {
        setProjects(data);
      } else if (data === null || data === undefined) {
        // Initialize with default data if empty
        set(projectsRef, cleanFirebaseData(initialProjects));
        setProjects(initialProjects);
      } else {
        // Fallback for invalid data structure
        setProjects(initialProjects);
      }
    });

    // Listen for custom rows changes
    const unsubscribeCustomRows = onValue(customRowsRef, (snapshot) => {
      const data = snapshot.val();
      // Safe array guard: only set if data is a valid array
      if (Array.isArray(data)) {
        setCustomRows(data);
      } else if (data === null || data === undefined) {
        // Initialize with default data if empty
        set(customRowsRef, cleanFirebaseData(initialCustomRows));
        setCustomRows(initialCustomRows);
      } else {
        // Fallback for invalid data structure
        setCustomRows(initialCustomRows);
      }
    });

    // Listen for teammates changes
    const unsubscribeTeammates = onValue(teammatesRef, (snapshot) => {
      const data = snapshot.val();
      // Safe array guard: only set if data is a valid array
      if (Array.isArray(data)) {
        setTeammates(data);
      } else if (data === null || data === undefined) {
        // Initialize with default data if empty
        set(teammatesRef, cleanFirebaseData(initialTeammates));
        setTeammates(initialTeammates);
      } else {
        // Fallback for invalid data structure
        setTeammates(initialTeammates);
      }
    });

    return () => {
      unsubscribeProjects();
      unsubscribeCustomRows();
      unsubscribeTeammates();
    };
  }, [isFirebaseReady]);

  // Helper function to safely update Firebase or local state
  const safeFirebaseSet = (path: string, data: any, localSetter?: (data: any) => void) => {
    if (db) {
      set(ref(db, path), cleanFirebaseData(data));
    } else {
      // When Firebase is not available, use localStorage
      if (localSetter) {
        localSetter(data);
      }
      try {
        localStorage.setItem(path, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  };

  const handleUpdateProject = (id: string, updates: Partial<ProjectCard>) => {
    const updatedProjects = (projects || []).map((p) => 
      p.id === id 
        ? { 
            ...p, 
            ...updates, 
            lastModifiedBy: currentUser,
            lastModifiedAt: Date.now()
          } 
        : p
    );
    safeFirebaseSet('projects', updatedProjects, setProjects);
  };

  const handleCardDrop = (cardId: string, newPriority: string, isCustom: boolean) => {
    const updatedProjects = (projects || []).map((p) => {
      if (p.id === cardId) {
        return {
          ...p,
          priority: newPriority,
          category: isCustom ? newPriority : undefined,
          lastModifiedBy: currentUser,
          lastModifiedAt: Date.now()
        };
      }
      return p;
    });
    safeFirebaseSet('projects', updatedProjects, setProjects);
  };

  const handleDeleteProject = (id: string) => {
    const updatedProjects = (projects || []).filter((p) => p.id !== id);
    safeFirebaseSet('projects', updatedProjects, setProjects);
  };

  const handleAddNewCard = (priority: string, isCustom: boolean = false) => {
    const newCard: ProjectCard = {
      id: `${Date.now()}`,
      lineNumber: (projects || []).length + 1,
      priority,
      projectName: 'New Project',
      subtasks: [],
      owner: 'TBD',
      ownerTags: [],
      status: 'todo',
      deliverableDate: '—',
      notes: '—',
      category: isCustom ? priority : undefined,
      lastModifiedBy: currentUser,
      lastModifiedAt: Date.now()
    };
    const updatedProjects = [...(projects || []), newCard];
    safeFirebaseSet('projects', updatedProjects, setProjects);
  };

  const handleAddCustomRow = () => {
    const newRow: CustomRow = {
      id: `custom-${Date.now()}`,
      name: 'New Category',
      color: 'bg-indigo-50 border-indigo-200',
    };
    const updatedRows = [...(customRows || []), newRow];
    safeFirebaseSet('customRows', updatedRows, setCustomRows);
  };

  const handleDeleteCustomRow = (rowId: string) => {
    const rowToDelete = (customRows || []).find(r => r.id === rowId);
    if (rowToDelete) {
      const updatedProjects = (projects || []).filter(p => p.category !== rowToDelete.name);
      const updatedRows = (customRows || []).filter(r => r.id !== rowId);
      safeFirebaseSet('projects', updatedProjects, setProjects);
      safeFirebaseSet('customRows', updatedRows, setCustomRows);
    }
  };

  const handleStartEditingRow = (rowId: string, currentName: string) => {
    setEditingRowId(rowId);
    setEditingRowName(currentName);
  };

  const handleSaveRowName = (rowId: string) => {
    const oldName = (customRows || []).find(r => r.id === rowId)?.name;
    const updatedRows = (customRows || []).map(r => r.id === rowId ? { ...r, name: editingRowName } : r);
    safeFirebaseSet('customRows', updatedRows, setCustomRows);
    
    if (oldName) {
      const updatedProjects = (projects || []).map(p => 
        p.category === oldName 
          ? { ...p, priority: editingRowName, category: editingRowName, lastModifiedBy: currentUser, lastModifiedAt: Date.now() } 
          : p
      );
      safeFirebaseSet('projects', updatedProjects, setProjects);
    }
    setEditingRowId(null);
    setEditingRowName('');
  };

  const handleAddTeammate = () => {
    if (newTeammateName.trim()) {
      const newTeammate: Teammate = {
        id: `${Date.now()}`,
        name: newTeammateName.trim(),
        color: teammateColors[(teammates || []).length % teammateColors.length],
      };
      const updatedTeammates = [...(teammates || []), newTeammate];
      safeFirebaseSet('teammates', updatedTeammates, setTeammates);
      setNewTeammateName('');
    }
  };

  const handleDeleteTeammate = (teammateId: string) => {
    const updatedTeammates = (teammates || []).filter(t => t.id !== teammateId);
    safeFirebaseSet('teammates', updatedTeammates, setTeammates);
    
    // Remove from all projects
    const updatedProjects = (projects || []).map(p => ({
      ...p,
      ownerTags: (p.ownerTags || []).filter(id => id !== teammateId),
      tags: (p.tags || []).filter(id => id !== teammateId),
      lastModifiedBy: currentUser,
      lastModifiedAt: Date.now()
    }));
    safeFirebaseSet('projects', updatedProjects, setProjects);
  };

  const handleStartEditingTeammate = (teammateId: string, currentName: string, currentEmail?: string) => {
    setEditingTeammateId(teammateId);
    setEditingTeammateName(currentName);
    setEditingTeammateEmail(currentEmail || '');
  };

  const handleSaveTeammateName = () => {
    if (editingTeammateName.trim() && editingTeammateId) {
      const updatedTeammates = (teammates || []).map(t => t.id === editingTeammateId ? { 
        ...t, 
        name: editingTeammateName.trim(),
        email: editingTeammateEmail.trim() || undefined
      } : t);
      safeFirebaseSet('teammates', updatedTeammates, setTeammates);
      setEditingTeammateId(null);
      setEditingTeammateName('');
      setEditingTeammateEmail('');
    }
  };

  // Group projects by priority
  const priorityRows = ['P0', 'P1', 'P2', 'P3', 'P4'];
  const groupedProjects: Record<string, ProjectCard[]> = {
    P0: (projects || []).filter(p => p.priority === 'P0'),
    P1: (projects || []).filter(p => p.priority === 'P1'),
    P2: (projects || []).filter(p => p.priority === 'P2'),
    P3: (projects || []).filter(p => p.priority === 'P3'),
    P4: (projects || []).filter(p => p.priority === 'P4'),
  };

  (customRows || []).forEach(row => {
    groupedProjects[row.name] = (projects || []).filter(p => p.category === row.name);
  });

  const priorityColors: Record<string, string> = {
    P0: 'bg-red-50 border-red-200',
    P1: 'bg-orange-50 border-orange-200',
    P2: 'bg-blue-50 border-blue-200',
    P3: 'bg-gray-50 border-gray-200',
    P4: 'bg-slate-50 border-slate-200',
  };

  const priorityLabels: Record<string, { label: string; color: string }> = {
    P0: { label: 'P0 - Critical', color: 'text-red-700' },
    P1: { label: 'P1 - High Priority', color: 'text-orange-700' },
    P2: { label: 'P2 - Medium Priority', color: 'text-blue-700' },
    P3: { label: 'P3 - Low Priority', color: 'text-gray-700' },
    P4: { label: 'P4 - Future Work', color: 'text-slate-700' },
  };

  const customRowColors: Record<string, string> = {
    Planned: 'text-purple-700',
    'In Discussions': 'text-teal-700',
    Backlog: 'text-slate-600',
  };

  // Initialize refs for all projects
  useEffect(() => {
    (projects || []).forEach(project => {
      if (!projectRefs.current[project.id]) {
        projectRefs.current[project.id] = { current: null };
      }
    });
  }, [projects]);

  // Scroll to project when clicked in sidebar
  const scrollToProject = (projectId: string) => {
    const ref = projectRefs.current[projectId];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedProjectId(projectId);
      setTimeout(() => setHighlightedProjectId(null), 2000);
    }
  };

  // Sort projects by priority for sidebar display
  const getSortedProjectsForSidebar = () => {
    const priorityOrder = ['P0', 'P1', 'P2', 'P3', 'P4'];
    
    return [...(projects || [])].sort((a, b) => {
      const aPriorityIndex = priorityOrder.indexOf(a.priority);
      const bPriorityIndex = priorityOrder.indexOf(b.priority);
      
      // If both are standard priorities (P0-P4)
      if (aPriorityIndex !== -1 && bPriorityIndex !== -1) {
        if (aPriorityIndex !== bPriorityIndex) {
          return aPriorityIndex - bPriorityIndex;
        }
        // Same priority, sort by lineNumber
        return a.lineNumber - b.lineNumber;
      }
      
      // If only 'a' is a standard priority, it comes first
      if (aPriorityIndex !== -1) return -1;
      
      // If only 'b' is a standard priority, it comes first
      if (bPriorityIndex !== -1) return 1;
      
      // Both are custom rows, sort alphabetically by priority name, then by lineNumber
      if (a.priority !== b.priority) {
        return a.priority.localeCompare(b.priority);
      }
      return a.lineNumber - b.lineNumber;
    });
  };

  // Handle project reorder from sidebar
  const handleSidebarProjectDrop = (draggedId: string, targetId: string) => {
    const draggedProject = (projects || []).find(p => p.id === draggedId);
    const targetProject = (projects || []).find(p => p.id === targetId);
    
    if (draggedProject && targetProject) {
      const allProjects = [...(projects || [])];
      
      // Get projects in target's priority, sorted
      const samePriorityProjects = allProjects
        .filter(p => p.priority === targetProject.priority)
        .sort((a, b) => a.lineNumber - b.lineNumber);
      
      // Remove dragged if already in this priority
      const withoutDragged = samePriorityProjects.filter(p => p.id !== draggedId);
      
      // Find where to insert
      const targetIdx = withoutDragged.findIndex(p => p.id === targetId);
      
      // Create updated dragged project
      const newDragged = {
        ...draggedProject,
        priority: targetProject.priority,
        category: targetProject.category,
        lastModifiedBy: currentUser,
        lastModifiedAt: Date.now()
      };
      
      // Insert at target position
      withoutDragged.splice(targetIdx, 0, newDragged);
      
      // Recalculate lineNumbers for this priority only
      withoutDragged.forEach((p, idx) => {
        p.lineNumber = idx + 1;
      });
      
      // Merge back with other priorities
      const otherProjects = allProjects.filter(p => 
        p.priority !== targetProject.priority && p.id !== draggedId
      );
      
      const finalProjects = [...otherProjects, ...withoutDragged];
      
      safeFirebaseSet('projects', finalProjects, setProjects);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#f5f5f5] flex">
      {/* Left Sidebar */}
      <div 
        className={`fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-20 ${
          isSidebarOpen ? 'w-80' : 'w-0'
        }`}
      >
        <div className={`h-full flex flex-col ${isSidebarOpen ? '' : 'hidden'}`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-bold text-lg">All Projects</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          
          {/* Add Project Button */}
          <div className="p-3 border-b border-gray-200">
            <button
              onClick={() => handleAddNewCard('P0')}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Project
            </button>
          </div>

          {/* Projects List */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="text-xs font-semibold text-gray-500 mb-2 px-2">
              {(projects || []).length} PROJECTS
            </div>
            <div className="space-y-1">
              {getSortedProjectsForSidebar().map((project, index, array) => {
                const previousProject = index > 0 ? array[index - 1] : null;
                const showDivider = previousProject && previousProject.priority !== project.priority;
                
                return (
                  <div key={project.id}>
                    {showDivider && (
                      <div className="flex items-center gap-2 py-2 px-2">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-xs font-bold text-gray-600">{project.priority}</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                      </div>
                    )}
                    {index === 0 && (
                      <div className="flex items-center gap-2 py-2 px-2">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-xs font-bold text-gray-600">{project.priority}</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                      </div>
                    )}
                    <SidebarProjectItem
                      project={project}
                      onDrop={handleSidebarProjectDrop}
                      onClick={() => scrollToProject(project.id)}
                      isHighlighted={highlightedProjectId === project.id}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Toggle Button (when closed) */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed left-0 top-20 bg-white border border-gray-200 rounded-r-lg p-2 shadow-lg z-20 hover:bg-gray-50 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-80' : 'ml-0'}`}>
        {/* Toolbar */}
        <div className="fixed top-0 right-0 bg-white border-b border-gray-200 shadow-sm z-10 px-6 py-4" style={{ left: isSidebarOpen ? '320px' : '0' }}>
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <h1 className="text-2xl font-bold">Project Board – Oracle Conversation Design Team</h1>
          <div className="flex items-center gap-4">
            {currentUser && (
              <div className="text-sm font-medium text-gray-700 bg-green-100 px-3 py-1 rounded-full border border-green-300">
                👤 {currentUser}
              </div>
            )}
            <div className="text-sm text-gray-600">
              {(projects || []).length} projects • {(teammates || []).length} teammates
            </div>
            <button
              onClick={() => setShowTeammatesManagementModal(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <Users className="w-4 h-4" />
              Manage Teammates
            </button>
            <button
              onClick={handleAddCustomRow}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Custom Row
            </button>
            <button
              onClick={() => setShowHowToUse(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              How to Use
            </button>
          </div>
        </div>
      </div>

      {/* Priority Lanes */}
      <div className="pt-20 px-6 pb-6">
        <div className="flex flex-col gap-6 max-w-screen-2xl mx-auto">
          {/* Fixed Priority Rows */}
          {priorityRows.map((priority, laneIndex) => (
            <PriorityRow
              key={priority}
              priority={priority}
              isCustom={false}
              projects={groupedProjects[priority]}
              onDrop={handleCardDrop}
            >
              <div className={`${priorityColors[priority]} border-2 rounded-lg p-5`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className={`font-bold text-xl ${priorityLabels[priority].color}`}>
                      {priorityLabels[priority].label}
                    </h2>
                    <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold">
                      {groupedProjects[priority]?.length || 0} {groupedProjects[priority]?.length === 1 ? 'project' : 'projects'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddNewCard(priority)}
                    className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-300 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Card
                  </button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {groupedProjects[priority]?.length > 0 ? (
                    groupedProjects[priority].map((project, index) => {
                      if (!projectRefs.current[project.id]) {
                        projectRefs.current[project.id] = { current: null };
                      }
                      return (
                        <div key={project.id} className="flex-shrink-0 w-80">
                          <EditableCard
                            project={project}
                            onUpdate={handleUpdateProject}
                            onDelete={handleDeleteProject}
                            laneIndex={laneIndex}
                            indexInLane={index}
                            teammates={teammates}
                            onShowOwnerModal={setShowOwnerModal}
                            onShowTagModal={setShowTagModal}
                            cardRef={projectRefs.current[project.id]}
                            isHighlighted={highlightedProjectId === project.id}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div className="w-full text-center py-8 text-gray-400 text-sm">
                      No projects in this priority level. Click "Add Card" to create one.
                    </div>
                  )}
                </div>
              </div>
            </PriorityRow>
          ))}

          {/* Custom Rows */}
          {(customRows || []).map((row, laneIndex) => (
            <PriorityRow
              key={row.id}
              priority={row.name}
              isCustom={true}
              projects={groupedProjects[row.name]}
              onDrop={handleCardDrop}
            >
              <div className={`${row.color} border-2 rounded-lg p-5`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {editingRowId === row.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingRowName}
                          onChange={(e) => setEditingRowName(e.target.value)}
                          className="font-bold text-xl px-2 py-1 border-2 border-blue-500 rounded focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveRowName(row.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h2 className={`font-bold text-xl ${customRowColors[row.name] || 'text-gray-700'}`}>
                          {row.name}
                        </h2>
                        <button
                          onClick={() => handleStartEditingRow(row.id, row.name)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold">
                      {groupedProjects[row.name]?.length || 0} {groupedProjects[row.name]?.length === 1 ? 'project' : 'projects'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddNewCard(row.name, true)}
                      className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-300 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Card
                    </button>
                    <button
                      onClick={() => handleDeleteCustomRow(row.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {groupedProjects[row.name]?.length > 0 ? (
                    groupedProjects[row.name].map((project, index) => {
                      if (!projectRefs.current[project.id]) {
                        projectRefs.current[project.id] = { current: null };
                      }
                      return (
                        <div key={project.id} className="flex-shrink-0 w-80">
                          <EditableCard
                            project={project}
                            onUpdate={handleUpdateProject}
                            onDelete={handleDeleteProject}
                            laneIndex={priorityRows.length + laneIndex}
                            indexInLane={index}
                            teammates={teammates}
                            onShowOwnerModal={setShowOwnerModal}
                            onShowTagModal={setShowTagModal}
                            cardRef={projectRefs.current[project.id]}
                            isHighlighted={highlightedProjectId === project.id}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div className="w-full text-center py-8 text-gray-400 text-sm">
                      No projects in this category. Click "Add Card" to create one.
                    </div>
                  )}
                </div>
              </div>
            </PriorityRow>
          ))}
        </div>
      </div>

      {/* Manage Teammates Modal */}
      {showTeammatesManagementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowTeammatesManagementModal(false)}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full m-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Manage Teammates</h2>
              <button onClick={() => setShowTeammatesManagementModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {(teammates || []).map(teammate => (
                <div key={teammate.id} className="flex flex-col gap-2 px-4 py-3 rounded-lg border-2 border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${teammate.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                      {teammate.name[0]}
                    </div>
                    {editingTeammateId === teammate.id ? (
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={editingTeammateName}
                          onChange={(e) => setEditingTeammateName(e.target.value)}
                          placeholder="Name"
                          className="w-full px-2 py-1 border-2 border-blue-500 rounded focus:outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveTeammateName();
                            if (e.key === 'Escape') {
                              setEditingTeammateId(null);
                              setEditingTeammateName('');
                              setEditingTeammateEmail('');
                            }
                          }}
                        />
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            value={editingTeammateEmail}
                            onChange={(e) => setEditingTeammateEmail(e.target.value)}
                            placeholder="email@oracle.com"
                            className="flex-1 px-2 py-1 border-2 border-blue-500 rounded focus:outline-none text-sm"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <div className="font-medium">{teammate.name}</div>
                        {teammate.email && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <Mail className="w-3 h-3" />
                            <span>{teammate.email}</span>
                          </div>
                        )}
                        {!teammate.email && (
                          <div className="text-xs text-gray-400 italic mt-0.5">No email set</div>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      {editingTeammateId === teammate.id ? (
                        <button
                          onClick={handleSaveTeammateName}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartEditingTeammate(teammate.id, teammate.name, teammate.email)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteTeammate(teammate.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTeammateName}
                onChange={(e) => setNewTeammateName(e.target.value)}
                placeholder="New teammate name"
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTeammate();
                }}
              />
              <button
                onClick={handleAddTeammate}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Set Owners Modal */}
      {showOwnerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowOwnerModal(null)}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Set Owners</h2>
              <button onClick={() => setShowOwnerModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2 mb-4">
              {(teammates || []).map(teammate => {
                const project = (projects || []).find(p => p.id === showOwnerModal);
                const isOwner = project?.ownerTags?.includes(teammate.id);
                return (
                  <button
                    key={teammate.id}
                    onClick={() => {
                      if (isOwner) {
                        handleUpdateProject(showOwnerModal, { 
                          ownerTags: project?.ownerTags?.filter(t => t !== teammate.id) 
                        });
                      } else {
                        handleUpdateProject(showOwnerModal, { 
                          ownerTags: [...(project?.ownerTags || []), teammate.id] 
                        });
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                      isOwner 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-8 h-8 ${teammate.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                      {teammate.name[0]}
                    </div>
                    <span className="font-medium">{teammate.name}</span>
                    {isOwner && (
                      <Check className="w-5 h-5 text-green-600 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowOwnerModal(null)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Tag Teammates Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowTagModal(null)}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Tag Teammates</h2>
              <button onClick={() => setShowTagModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2 mb-4">
              {(teammates || []).map(teammate => {
                const project = (projects || []).find(p => p.id === showTagModal);
                const isTagged = project?.tags?.includes(teammate.id);
                return (
                  <button
                    key={teammate.id}
                    onClick={() => {
                      if (isTagged) {
                        handleUpdateProject(showTagModal, { 
                          tags: project?.tags?.filter(t => t !== teammate.id) 
                        });
                      } else {
                        handleUpdateProject(showTagModal, { 
                          tags: [...(project?.tags || []), teammate.id] 
                        });
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                      isTagged 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-8 h-8 ${teammate.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                      {teammate.name[0]}
                    </div>
                    <span className="font-medium">{teammate.name}</span>
                    {isTagged && (
                      <Check className="w-5 h-5 text-blue-600 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowTagModal(null)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Notification Info Modal */}
      {showNotificationInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowNotificationInfo(false)}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold">Email Notifications</h2>
              </div>
              <button onClick={() => setShowNotificationInfo(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                When you tag teammates or set project owners, they will automatically receive email notifications about project updates.
              </p>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-2">📧 Notifications are sent when:</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>They're added as an <strong>owner</strong> or <strong>tagged teammate</strong> on a project</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>The project <strong>status changes</strong> (To do → In progress → Done → On hold)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>The project is <strong>moved to a different priority</strong> level</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>A <strong>deliverable date</strong> is approaching (<strong>72 hours before</strong>)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Project is <strong>on hold</strong> or <strong>to do</strong> status for more than <strong>72 hours</strong></span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                <h3 className="font-bold text-yellow-900 mb-2">⚙️ To enable email notifications:</h3>
                <ol className="space-y-2 text-sm text-yellow-800 list-decimal list-inside">
                  <li>Go to <strong>"Manage Teammates"</strong> in the toolbar</li>
                  <li>Click the email icon next to each teammate</li>
                  <li>Add their email address</li>
                  <li>They'll start receiving notifications automatically!</li>
                </ol>
              </div>

              <p className="text-xs text-gray-500 italic">
                💡 Tip: Teammates can customize their notification preferences by clicking the link in any notification email.
              </p>
            </div>

            <button
              onClick={() => setShowNotificationInfo(false)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mt-6"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* How to Use Modal */}
      {showHowToUse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowHowToUse(false)}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full m-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">How to Use Project Cards</h2>
              </div>
              <button onClick={() => setShowHowToUse(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-5">
              <p className="text-gray-700">
                Welcome to your interactive project management board! This guide will help you get started with managing projects and collaborating with your team.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <GripVertical className="w-5 h-5" />
                  Moving Project Cards
                </h3>
                <p className="text-sm text-blue-800">
                  <strong>Drag and Drop:</strong> Click and hold any project card by the grip handle (⋮⋮) and drag it to any priority row (P0-P4) or custom category. The priority will update automatically!
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
                <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <Edit2 className="w-5 h-5" />
                  Editing Projects
                </h3>
                <ul className="space-y-2 text-sm text-green-800">
                  <li>• <strong>Project Name:</strong> Click on the project title to edit it inline</li>
                  <li>• <strong>Subtasks:</strong> Check/uncheck boxes to mark completion, edit text inline, or delete with the X button</li>
                  <li>• <strong>Add Subtask:</strong> Click "+ Add subtask" at the bottom of the subtask list</li>
                  <li>• <strong>Notes & Dates:</strong> Click any field to edit directly</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-lg p-4">
                <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Assigning Team Members
                </h3>
                <ul className="space-y-2 text-sm text-amber-800">
                  <li>• <strong>Set Owners:</strong> Click the <Users className="w-3 h-3 inline" /> icon next to "Owner" to assign project owners (can be multiple people)</li>
                  <li>• <strong>Tag Teammates:</strong> Click the <Users className="w-3 h-3 inline" /> icon under "Tagged Teammates" to loop in collaborators</li>
                  <li>• <strong>Manage Team:</strong> Use "Manage Teammates" in the toolbar to add/edit/delete team members and their emails</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4">
                <h3 className="font-bold text-purple-900 mb-3">🔄 Status Management</h3>
                <p className="text-sm text-purple-800 mb-2">
                  Click the status badge to cycle through:
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="bg-gray-400 text-white px-3 py-1 rounded-full">To do</span>
                  <span className="text-gray-400">→</span>
                  <span className="bg-[#eb9632] text-white px-3 py-1 rounded-full">In progress</span>
                  <span className="text-gray-400">→</span>
                  <span className="bg-[#6FA939] text-white px-3 py-1 rounded-full">Done</span>
                  <span className="text-gray-400">→</span>
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full">On hold</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-gray-500">back to To do</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-4">
                <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Deliverable Dates
                </h3>
                <p className="text-sm text-red-800">
                  Click on the <strong>Deliverable Date</strong> field to open a calendar picker. Your team will receive reminders <strong>72 hours before</strong> the deadline!
                </p>
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-lg p-4">
                <h3 className="font-bold text-teal-900 mb-3 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Adding & Organizing
                </h3>
                <ul className="space-y-2 text-sm text-teal-800">
                  <li>• <strong>New Card:</strong> Click "Add Card" in any priority row to create a new project</li>
                  <li>• <strong>Custom Rows:</strong> Click "Add Custom Row" in the toolbar to create categories like "Backlog" or "Planning"</li>
                  <li>• <strong>Delete Card:</strong> Click the X button in the top-right corner of any card</li>
                  <li>• <strong>Edit Row Names:</strong> Click the ✏️ icon next to custom row names to rename them</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-300 rounded-lg p-5">
                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Email Notifications
                </h3>
                <p className="text-sm text-blue-800 mb-3">
                  Keep your team in the loop! Tagged teammates and owners receive automatic email updates.
                </p>
                <button
                  onClick={() => {
                    setShowHowToUse(false);
                    setShowNotificationInfo(true);
                  }}
                  className="text-blue-600 hover:text-blue-700 underline underline-offset-2 font-semibold text-sm"
                >
                  → Learn more about how notifications work
                </button>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-lg p-5">
                <h3 className="font-bold text-purple-900 mb-2">
                  🔄 Real-Time Collaboration
                </h3>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li>• All changes sync instantly across all team members</li>
                  <li>• See who made the last edit on each project card</li>
                  <li>• Your name ({currentUser}) appears in the top toolbar</li>
                  <li>• Multiple people can edit simultaneously!</li>
                </ul>
              </div>

              <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4">
                <p className="text-sm text-gray-700 text-center italic">
                  💡 <strong>Pro Tip:</strong> All changes are saved automatically and synced in real-time!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHowToUse(false)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mt-6 font-semibold"
            >
              Got it! Let's get started 🚀
            </button>
          </div>
        </div>
      )}

      {/* User Name Prompt Modal */}
      {showUserPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Welcome to the Project Board! 👋</h2>
            <p className="text-gray-700 mb-6">
              Please enter your name so your teammates can see who makes changes to the board.
            </p>
            <input
              type="text"
              value={userNameInput}
              onChange={(e) => setUserNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && userNameInput.trim()) {
                  localStorage.setItem('figJamUserName', userNameInput.trim());
                  setCurrentUser(userNameInput.trim());
                  setShowUserPrompt(false);
                  setIsFirebaseReady(true);
                }
              }}
              placeholder="Enter your name..."
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <button
              onClick={() => {
                if (userNameInput.trim()) {
                  localStorage.setItem('figJamUserName', userNameInput.trim());
                  setCurrentUser(userNameInput.trim());
                  setShowUserPrompt(false);
                  setIsFirebaseReady(true);
                }
              }}
              disabled={!userNameInput.trim()}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}