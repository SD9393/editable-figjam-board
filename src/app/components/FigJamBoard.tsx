import { useState, useEffect, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, Plus, X, Edit2, Check, Users, Calendar, Trash2, HelpCircle, ChevronLeft, ChevronRight, Package, Tag, Filter, Sun, Moon } from 'lucide-react';
import { db } from '@/config/firebase';
import { ref, set, onValue, update, onDisconnect, serverTimestamp, remove } from 'firebase/database';

// ========================================
// Oracle Redwood Design System Color Palette
// ========================================
const OracleColors = {
  // Primary Colors - Lighter (for light mode backgrounds)
  lighter: {
    teal: '#C5E9ED',      // 1
    green: '#D5EDD3',     // 2  
    olive: '#E6EBD0',     // 3
    orange: '#FBDCC8',    // 4
    red: '#FFCFC9',       // 5
    purple: '#E8D4ED',    // 6
    blue: '#CFE2F3',      // 7
    navy: '#D5E0ED',      // 8
    gray: '#E0E0E0',      // 9
    darkGray: '#D5D5D5',  // 10
  },
  // Primary Colors (mid-tone - for text and borders)
  primary: {
    teal: '#00A3AD',      // 1
    green: '#3F8C3F',     // 2
    olive: '#A2A32D',     // 3
    orange: '#E67437',    // 4
    red: '#C74634',       // 5
    purple: '#803D99',    // 6
    blue: '#0572CE',      // 7
    navy: '#344D66',      // 8
    gray: '#78716C',      // 9
    darkGray: '#57534E',  // 10
  },
  // Primary Colors - Darker (for dark mode backgrounds)
  darker: {
    teal: '#1C4D52',      // 1
    green: '#22472B',     // 2
    olive: '#4A4A1F',     // 3
    orange: '#6B3A1F',    // 4
    red: '#5C2E29',       // 5
    purple: '#4A2952',    // 6
    blue: '#1F3D5C',      // 7
    navy: '#1F2E3D',      // 8
    gray: '#3D3D3D',      // 9
    darkGray: '#2E2E2E',  // 10
  },
};

interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

interface Deliverable {
  id: string;
  text: string;
  status: 'todo' | 'inProgress' | 'done' | 'blocked';
}

interface ProjectCard {
  id: string;
  lineNumber: number;
  priority: string;
  projectName: string;
  subtasks: Subtask[];
  deliverables?: Deliverable[];
  owner: string;
  ownerTags?: string[]; // Owner as tags
  status: 'inProgress' | 'done' | 'todo' | 'onHold';
  deliverableDate: string;
  release?: string; // Release version
  notes: string;
  category?: string; // For custom rows
  tags?: string[]; // Tagged teammates
  projectTags?: string[]; // Project topic/category tags for filtering
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
    release: 'TBD',
    notes: 'hand off end of Jan',
    projectTags: ['Seeded Topics', 'Bias'],
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
    projectTags: ['Seeded Topics', 'VT'],
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
    projectTags: ['VT', 'Metrics'],
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
    projectTags: ['Seeded Topics', 'Form Factor'],
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
    projectTags: ['Testing', 'Automation'],
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
    projectTags: ['GenAI', 'Performance'],
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
    projectTags: ['VT'],
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
    projectTags: ['VT'],
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
    projectTags: ['Seeded Topics', 'Filters'],
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
  { id: 'planned', name: 'Planned', color: 'bg-[#E8D4ED] border-[#803D99]' },
  { id: 'discussions', name: 'In Discussions', color: 'bg-[#C5E9ED] border-[#00A3AD]' },
  { id: 'backlog', name: 'Backlog', color: 'bg-[#E0E0E0] border-[#78716C]' },
];

const initialTeammates: Teammate[] = [
  { id: '1', name: 'Edosa', color: 'bg-[#0572CE]' },
  { id: '2', name: 'Palak', color: 'bg-[#3F8C3F]' },
  { id: '3', name: 'Samrat', color: 'bg-[#C74634]' },
  { id: '4', name: 'Surya', color: 'bg-[#A2A32D]' },
  { id: '5', name: 'Sid', color: 'bg-[#803D99]' },
  { id: '6', name: 'Gowri', color: 'bg-[#E67437]' },
  { id: '7', name: 'April', color: 'bg-[#344D66]' },
  { id: '8', name: 'TBD', color: 'bg-[#78716C]' },
  { id: '9', name: 'Samriddho', color: 'bg-[#00A3AD]' },
];

const teammateColors = [
  'bg-[#0572CE]', 'bg-[#3F8C3F]', 'bg-[#C74634]', 'bg-[#A2A32D]',
  'bg-[#803D99]', 'bg-[#E67437]', 'bg-[#344D66]', 'bg-[#00A3AD]',
  'bg-[#78716C]', 'bg-[#57534E]'
];

function SidebarProjectItem({ 
  project, 
  onDrop, 
  onClick, 
  isHighlighted,
  isDarkTheme
}: { 
  project: ProjectCard; 
  onDrop: (draggedId: string, targetId: string) => void;
  onClick: () => void;
  isHighlighted: boolean;
  isDarkTheme?: boolean;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'sidebar-project',
    item: { id: project.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [project.id]);

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
  }), [project.id, onDrop]);

  const priorityColorMap: Record<string, string> = {
    P0: 'bg-[#C74634]',
    P1: 'bg-[#F57C00]',
    P2: 'bg-[#F9A825]',
    P3: 'bg-[#2E7D32]',
    P4: 'bg-[#0572CE]',
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      onClick={onClick}
      className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${
        isDragging ? 'opacity-50' : ''
      } ${
        isOver ? 'border-t-2 border-[#0572CE]' : ''
      } ${
        isHighlighted 
          ? 'bg-[#FFF9C4] ring-2 ring-[#F9A825]' 
          : isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
      }`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <span className={`text-sm truncate flex-1 ${isDarkTheme ? 'text-gray-200' : 'text-gray-900'}`}>
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
  onShowDeliverablesModal,
  onShowProjectTagsModal,
  cardRef,
  isHighlighted,
  isDarkTheme
}: { 
  project: ProjectCard; 
  onUpdate: (id: string, updates: Partial<ProjectCard>) => void;
  onDelete: (id: string) => void;
  laneIndex: number;
  indexInLane: number;
  teammates: Teammate[];
  onShowOwnerModal: (projectId: string) => void;
  onShowTagModal: (projectId: string) => void;
  onShowDeliverablesModal: (projectId: string) => void;
  onShowProjectTagsModal: (projectId: string) => void;
  cardRef?: React.RefObject<HTMLDivElement>;
  isHighlighted?: boolean;
  isDarkTheme?: boolean;
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
    inProgress: 'bg-[#E67437]',
    done: 'bg-[#3F8C3F]',
    todo: 'bg-[#78716C]',
    onHold: 'bg-[#803D99]',
  };

  const statusLabels = {
    inProgress: 'In progress',
    done: 'Done',
    todo: 'To do',
    onHold: 'On hold',
  };

  // Oracle Redwood card badge colors
  const priorityColors: Record<string, React.CSSProperties> = isDarkTheme ? {
    // Dark mode: darker backgrounds with lighter text
    P0: { backgroundColor: OracleColors.darker.red, color: OracleColors.lighter.red, borderColor: OracleColors.primary.red },
    P1: { backgroundColor: OracleColors.darker.orange, color: OracleColors.lighter.orange, borderColor: OracleColors.primary.orange },
    P2: { backgroundColor: OracleColors.darker.olive, color: OracleColors.lighter.olive, borderColor: OracleColors.primary.olive },
    P3: { backgroundColor: OracleColors.darker.green, color: OracleColors.lighter.green, borderColor: OracleColors.primary.green },
    P4: { backgroundColor: OracleColors.darker.blue, color: OracleColors.lighter.blue, borderColor: OracleColors.primary.blue },
    Planned: { backgroundColor: OracleColors.darker.purple, color: OracleColors.lighter.purple, borderColor: OracleColors.primary.purple },
    'In Discussions': { backgroundColor: OracleColors.darker.teal, color: OracleColors.lighter.teal, borderColor: OracleColors.primary.teal },
    Backlog: { backgroundColor: OracleColors.darker.gray, color: OracleColors.lighter.gray, borderColor: OracleColors.primary.gray },
  } : {
    // Light mode: lighter backgrounds with primary text
    P0: { backgroundColor: OracleColors.lighter.red, color: OracleColors.primary.red, borderColor: OracleColors.primary.red },
    P1: { backgroundColor: OracleColors.lighter.orange, color: OracleColors.primary.orange, borderColor: OracleColors.primary.orange },
    P2: { backgroundColor: OracleColors.lighter.olive, color: OracleColors.primary.olive, borderColor: OracleColors.primary.olive },
    P3: { backgroundColor: OracleColors.lighter.green, color: OracleColors.primary.green, borderColor: OracleColors.primary.green },
    P4: { backgroundColor: OracleColors.lighter.blue, color: OracleColors.primary.blue, borderColor: OracleColors.primary.blue },
    Planned: { backgroundColor: OracleColors.lighter.purple, color: OracleColors.primary.purple, borderColor: OracleColors.primary.purple },
    'In Discussions': { backgroundColor: OracleColors.lighter.teal, color: OracleColors.primary.teal, borderColor: OracleColors.primary.teal },
    Backlog: { backgroundColor: OracleColors.lighter.gray, color: OracleColors.primary.gray, borderColor: OracleColors.primary.gray },
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
      }}
      className={`rounded-lg shadow-md p-5 border-2 hover:shadow-lg transition-all ${
        isDarkTheme ? 'bg-gray-800' : 'bg-white'
      } ${
        isHighlighted 
          ? 'border-yellow-400 ring-4 ring-yellow-300 ring-opacity-50' 
          : isDarkTheme ? 'border-gray-700' : 'border-gray-200'
      }`}
    >
      {/* Header with drag handle, priority, tags and delete button */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <GripVertical className="text-gray-400 w-5 h-5 cursor-move" />
          <span 
            className="px-2.5 py-0.5 rounded-full text-xs font-bold border-2"
            style={priorityColors[project.priority] || { backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#d1d5db' }}
          >
            {project.priority}
          </span>
          {/* Project Tags inline */}
          {(project.projectTags || []).map((tag, index) => (
            <div key={index} className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
              {tag}
            </div>
          ))}
          <button
            onClick={() => onShowProjectTagsModal(project.id)}
            className="text-gray-400 hover:text-gray-600"
            title="Manage project tags"
          >
            <Tag className="w-3.5 h-3.5" />
          </button>
        </div>
        <button
          onClick={() => onDelete(project.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Project Name and Status */}
      <div className="flex items-center gap-2 mb-3">
        <input
          type="text"
          value={project.projectName}
          onChange={(e) => onUpdate(project.id, { projectName: e.target.value })}
          className={`flex-1 min-w-0 text-lg font-bold border-b-2 border-transparent hover:border-gray-300 focus:border-[#0572CE] focus:outline-none px-1 py-1 ${
            isDarkTheme ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
          }`}
        />
        <button
          onClick={handleStatusChange}
          className={`${statusColors[project.status]} text-white px-2.5 py-0.5 rounded-full text-[10px] font-semibold hover:opacity-80 transition-opacity whitespace-nowrap flex-shrink-0`}
        >
          {statusLabels[project.status]}
        </button>
      </div>

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
              className={`flex-1 border-b border-transparent hover:border-gray-300 focus:border-[#0572CE] focus:outline-none px-1 text-xs ${
                subtask.completed ? 'line-through text-gray-400' : isDarkTheme ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'
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
        <label className={`text-[10px] uppercase tracking-wide ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Owner</label>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {ownerTags.map(ownerId => {
            const teammate = teammates.find(t => t.id === ownerId);
            if (!teammate) return null;
            // Extract hex color from Tailwind class (e.g., "bg-[#0572CE]" -> "#0572CE")
            const hexColor = teammate.color.match(/#[0-9A-Fa-f]{6}/)?.[0] || '#0572CE';
            return (
              <div 
                key={ownerId} 
                className="px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1"
                style={{ backgroundColor: hexColor }}
              >
                {teammate.name}
              </div>
            );
          })}
          <button
            onClick={() => onShowOwnerModal(project.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Users className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date and Release Row */}
      <div className="mb-2 flex gap-3">
        {/* Deliverable Date with Calendar */}
        <div className="flex-1">
          <label className={`text-[10px] uppercase tracking-wide ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Deliverable Date</label>
          <input
            type="date"
            id={`date-picker-${project.id}`}
            value={sanitizeDateForInput(project.deliverableDate)}
            onChange={(e) => onUpdate(project.id, { deliverableDate: e.target.value || '—' })}
            className={`w-full border-b border-transparent hover:border-gray-300 focus:border-[#0572CE] focus:outline-none text-xs cursor-pointer ${
              isDarkTheme ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'
            }`}
            style={{ colorScheme: isDarkTheme ? 'dark' : 'light' }}
          />
        </div>

        {/* Release Dropdown */}
        <div className="flex-1">
          <label className={`text-[10px] uppercase tracking-wide ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Release</label>
          <select
            value={project.release || 'TBD'}
            onChange={(e) => onUpdate(project.id, { release: e.target.value })}
            className={`w-full border-b border-transparent hover:border-gray-300 focus:border-[#0572CE] focus:outline-none text-xs ${
              isDarkTheme ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'
            }`}
          >
            <option value="26B">26B</option>
            <option value="26C">26C</option>
            <option value="26D">26D</option>
            <option value="27A">27A</option>
            <option value="27B">27B</option>
            <option value="27C">27C</option>
            <option value="27D">27D</option>
            <option value="28A">28A</option>
            <option value="TBD">TBD</option>
          </select>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-2">
        <label className={`text-[10px] uppercase tracking-wide ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Notes</label>
        <textarea
          value={project.notes}
          onChange={(e) => onUpdate(project.id, { notes: e.target.value })}
          className={`w-full border-b border-transparent hover:border-gray-300 focus:border-[#0572CE] focus:outline-none px-1 text-xs resize-none ${
            isDarkTheme ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'
          }`}
          rows={1}
        />
      </div>

      {/* Deliverables Link */}
      <div className="mb-2">
        <button
          onClick={() => onShowDeliverablesModal(project.id)}
          className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1 underline"
        >
          <Package className="w-3 h-3" />
          Deliverable ({(project.deliverables || []).length})
        </button>
      </div>

      {/* Tagged Teammates */}
      <div className="mt-2">
        <label className="text-[10px] text-gray-500 uppercase tracking-wide">Tagged Teammates</label>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {tags.map(tagId => {
            const teammate = teammates.find(t => t.id === tagId);
            if (!teammate) return null;
            // Extract hex color from Tailwind class (e.g., "bg-[#0572CE]" -> "#0572CE")
            const hexColor = teammate.color.match(/#[0-9A-Fa-f]{6}/)?.[0] || '#0572CE';
            return (
              <div 
                key={tagId} 
                className="w-7 h-7 rounded-full text-xs font-bold text-white flex items-center justify-center" 
                style={{ backgroundColor: hexColor }}
                title={teammate.name}
              >
                {teammate.name.charAt(0).toUpperCase()}
              </div>
            );
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
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [customRows, setCustomRows] = useState<CustomRow[]>([]);
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingRowName, setEditingRowName] = useState('');
  const [showTeammatesManagementModal, setShowTeammatesManagementModal] = useState(false);
  const [showOwnerModal, setShowOwnerModal] = useState<string | null>(null);
  const [showTagModal, setShowTagModal] = useState<string | null>(null);
  const [showDeliverablesModal, setShowDeliverablesModal] = useState<string | null>(null);
  const [showProjectTagsModal, setShowProjectTagsModal] = useState<string | null>(null);
  const [newTeammateName, setNewTeammateName] = useState('');
  const [editingTeammateId, setEditingTeammateId] = useState<string | null>(null);
  const [editingTeammateName, setEditingTeammateName] = useState('');
  const [showHowToUse, setShowHowToUse] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [showUserPrompt, setShowUserPrompt] = useState(false);
  const [userNameInput, setUserNameInput] = useState('');
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [highlightedProjectId, setHighlightedProjectId] = useState<string | null>(null);
  const [selectedProjectTags, setSelectedProjectTags] = useState<string[]>([]);
  const [newProjectTagInput, setNewProjectTagInput] = useState('');
  const [availableProjectTags, setAvailableProjectTags] = useState<string[]>([]);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, { name: string; timestamp: number }>>({});
  const [showOnlineUsersModal, setShowOnlineUsersModal] = useState(false);
  
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

  // If Firebase missing → local fallback
  if (!db) {
    setProjects(initialProjects);
    setCustomRows(initialCustomRows);
    setTeammates(initialTeammates);
    setIsDataLoaded(true);
    return;
  }

  const projectsRef = ref(db, "projects");
  const customRowsRef = ref(db, "customRows");
  const teammatesRef = ref(db, "teammates");

  let projectsReady = false;
  let rowsReady = false;
  let teammatesReady = false;

  const checkReady = () => {
    if (projectsReady && rowsReady && teammatesReady) {
      setIsDataLoaded(true);
    }
  };

  // -------- PROJECTS ----------
  const unsubProjects = onValue(
    projectsRef,
    (snap) => {
      const data = snap.val();

      if (!data) {
        set(projectsRef, cleanFirebaseData(initialProjects));
        setProjects(initialProjects);
      } else {
        const arr = Array.isArray(data) ? data : Object.values(data);
        setProjects(arr);
      }

      projectsReady = true;
      checkReady();
    },
    () => {
      setProjects(initialProjects);
      projectsReady = true;
      checkReady();
    }
  );

  // -------- CUSTOM ROWS ----------
  const unsubRows = onValue(
    customRowsRef,
    (snap) => {
      const data = snap.val();

      if (!data) {
        set(customRowsRef, cleanFirebaseData(initialCustomRows));
        setCustomRows(initialCustomRows);
      } else {
        const arr = Array.isArray(data) ? data : Object.values(data);
        setCustomRows(arr);
      }

      rowsReady = true;
      checkReady();
    },
    () => {
      setCustomRows(initialCustomRows);
      rowsReady = true;
      checkReady();
    }
  );

  // -------- TEAMMATES ----------
  const unsubTeammates = onValue(
    teammatesRef,
    (snap) => {
      const data = snap.val();

      if (!data) {
        set(teammatesRef, cleanFirebaseData(initialTeammates));
        setTeammates(initialTeammates);
      } else {
        const arr = Array.isArray(data) ? data : Object.values(data);
        setTeammates(arr);
      }

      teammatesReady = true;
      checkReady();
    },
    () => {
      setTeammates(initialTeammates);
      teammatesReady = true;
      checkReady();
    }
  );

  return () => {
    unsubProjects();
    unsubRows();
    unsubTeammates();
  };
}, [isFirebaseReady]);

  // User presence tracking
  useEffect(() => {
    if (!isFirebaseReady || !currentUser || !db) return;

    const presenceRef = ref(db, `presence/${currentUser.replace(/[.#$[\]]/g, '_')}`);
    const allPresenceRef = ref(db, 'presence');

    // Set user as online
    const userPresence = {
      name: currentUser,
      timestamp: Date.now()
    };

    set(presenceRef, userPresence);

    // Remove user from presence when they disconnect
    onDisconnect(presenceRef).remove();

    // Listen to all online users
    const unsubscribePresence = onValue(allPresenceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setOnlineUsers(data);
      } else {
        setOnlineUsers({});
      }
    });

    // Update timestamp every 30 seconds to show activity
    const intervalId = setInterval(() => {
      set(presenceRef, {
        name: currentUser,
        timestamp: Date.now()
      });
    }, 30000);

    return () => {
      unsubscribePresence();
      clearInterval(intervalId);
      // Clean up presence on unmount
      remove(presenceRef);
    };
  }, [isFirebaseReady, currentUser]);

  // Extract all unique project tags from projects
  useEffect(() => {
    const allTags = new Set<string>();
    (projects || []).forEach(project => {
      (project.projectTags || []).forEach(tag => allTags.add(tag));
    });
    setAvailableProjectTags(Array.from(allTags).sort());
  }, [projects]);

  // Helper function to safely update Firebase or local state
  const safeFirebaseSet = (path: string, data: any) => {
  if (db) {
    set(ref(db, path), cleanFirebaseData(data));
  }
};

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
    safeFirebaseSet('projects', updatedProjects);
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
    safeFirebaseSet('projects', updatedProjects);
  };

  const handleDeleteProject = (id: string) => {
    const updatedProjects = (projects || []).filter((p) => p.id !== id);
    safeFirebaseSet('projects', updatedProjects);
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
    safeFirebaseSet('projects', updatedProjects);
  };

  const handleAddCustomRow = () => {
    const newRow: CustomRow = {
      id: `custom-${Date.now()}`,
      name: 'New Category',
      color: 'bg-[#D5E0ED] border-[#344D66]',
    };
    const updatedRows = [...(customRows || []), newRow];
    safeFirebaseSet('customRows', updatedRows, setCustomRows);
  };

  const handleDeleteCustomRow = (rowId: string) => {
    const rowToDelete = (customRows || []).find(r => r.id === rowId);
    if (rowToDelete) {
      const updatedProjects = (projects || []).filter(p => p.category !== rowToDelete.name);
      const updatedRows = (customRows || []).filter(r => r.id !== rowId);
      safeFirebaseSet('projects', updatedProjects, setProjectsHydrated);
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
      safeFirebaseSet('projects', updatedProjects, setProjectsHydrated);
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
    safeFirebaseSet('projects', updatedProjects);
  };

  const handleStartEditingTeammate = (teammateId: string, currentName: string) => {
    setEditingTeammateId(teammateId);
    setEditingTeammateName(currentName);
  };

  const handleSaveTeammateName = () => {
    if (editingTeammateName.trim() && editingTeammateId) {
      const updatedTeammates = (teammates || []).map(t => t.id === editingTeammateId ? { 
        ...t, 
        name: editingTeammateName.trim()
      } : t);
      safeFirebaseSet('teammates', updatedTeammates, setTeammates);
      setEditingTeammateId(null);
      setEditingTeammateName('');
    }
  };

  // Filter projects by selected project tags
  const filterByProjectTags = (projectsList: ProjectCard[]) => {
    if (selectedProjectTags.length === 0) return projectsList;
    return projectsList.filter(project => {
      const projectTags = project.projectTags || [];
      return selectedProjectTags.some(selectedTag => projectTags.includes(selectedTag));
    });
  };

  // Group projects by priority
  const priorityRows = ['P0', 'P1', 'P2', 'P3', 'P4'];
  const groupedProjects: Record<string, ProjectCard[]> = {
    P0: filterByProjectTags((projects || []).filter(p => p.priority === 'P0')),
    P1: filterByProjectTags((projects || []).filter(p => p.priority === 'P1')),
    P2: filterByProjectTags((projects || []).filter(p => p.priority === 'P2')),
    P3: filterByProjectTags((projects || []).filter(p => p.priority === 'P3')),
    P4: filterByProjectTags((projects || []).filter(p => p.priority === 'P4')),
  };

  (customRows || []).forEach(row => {
    groupedProjects[row.name] = filterByProjectTags((projects || []).filter(p => p.category === row.name));
  });

  // Oracle Redwood priority row background colors
  const priorityRowStyles: Record<string, React.CSSProperties> = isDarkTheme ? {
    // Dark mode: darker backgrounds (P0 has no background color)
    P0: { borderColor: OracleColors.primary.red },
    P1: { borderColor: OracleColors.primary.orange },
    P2: { borderColor: OracleColors.primary.olive },
    P3: { borderColor: OracleColors.primary.green },
    P4: { borderColor: OracleColors.primary.blue },
  } : {
    // Light mode: lighter backgrounds (P0 has no background color)
    P0: { borderColor: OracleColors.primary.red },
    P1: { borderColor: OracleColors.primary.orange },
    P2: { borderColor: OracleColors.primary.olive },
    P3: { borderColor: OracleColors.primary.green },
    P4: { borderColor: OracleColors.primary.blue },
  };

  const priorityLabels: Record<string, { label: string; style: React.CSSProperties }> = isDarkTheme ? {
    // Dark mode: lighter text for contrast
    P0: { label: 'P0 - Critical', style: { color: OracleColors.lighter.red } },
    P1: { label: 'P1 - High Priority', style: { color: OracleColors.lighter.orange } },
    P2: { label: 'P2 - Medium Priority', style: { color: OracleColors.lighter.olive } },
    P3: { label: 'P3 - Low Priority', style: { color: OracleColors.lighter.green } },
    P4: { label: 'P4 - Future Work', style: { color: OracleColors.lighter.blue } },
  } : {
    // Light mode: primary colors
    P0: { label: 'P0 - Critical', style: { color: OracleColors.primary.red } },
    P1: { label: 'P1 - High Priority', style: { color: OracleColors.primary.orange } },
    P2: { label: 'P2 - Medium Priority', style: { color: OracleColors.primary.olive } },
    P3: { label: 'P3 - Low Priority', style: { color: OracleColors.primary.green } },
    P4: { label: 'P4 - Future Work', style: { color: OracleColors.primary.blue } },
  };

  const customRowColors: Record<string, React.CSSProperties> = isDarkTheme ? {
    // Dark mode: lighter text
    Planned: { color: OracleColors.lighter.purple },
    'In Discussions': { color: OracleColors.lighter.teal },
    Backlog: { color: OracleColors.lighter.gray },
  } : {
    // Light mode: primary colors
    Planned: { color: OracleColors.primary.purple },
    'In Discussions': { color: OracleColors.primary.teal },
    Backlog: { color: OracleColors.primary.gray },
  };

  // Oracle Redwood custom row background colors
  const customRowBackgrounds: Record<string, React.CSSProperties> = isDarkTheme ? {
    // Dark mode: no background colors, only borders
    Planned: { borderColor: OracleColors.primary.purple },
    'In Discussions': { borderColor: OracleColors.primary.teal },
    Backlog: { borderColor: OracleColors.primary.gray },
  } : {
    // Light mode: no background colors, only borders
    Planned: { borderColor: OracleColors.primary.purple },
    'In Discussions': { borderColor: OracleColors.primary.teal },
    Backlog: { borderColor: OracleColors.primary.gray },
  };

  // Helper function to get row background color
  const getCustomRowBgColor = (rowName: string): React.CSSProperties => {
    return customRowBackgrounds[rowName] || (isDarkTheme 
      ? { borderColor: OracleColors.primary.navy }
      : { borderColor: OracleColors.primary.navy });
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
    
    // Filter by selected project tags
    let filteredProjects = [...(projects || [])];
    if (selectedProjectTags.length > 0) {
      filteredProjects = filteredProjects.filter(project => {
        const projectTags = project.projectTags || [];
        return selectedProjectTags.some(selectedTag => projectTags.includes(selectedTag));
      });
    }
    
    return filteredProjects.sort((a, b) => {
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
      
      // Recalculate lineNumbers for this priority only - CREATE NEW OBJECTS
      const reorderedPriorityGroup = withoutDragged.map((p, idx) => ({
        ...p,
        lineNumber: idx + 1
      }));
      
      // Merge back with other priorities
      const otherProjects = allProjects.filter(p => 
        p.priority !== targetProject.priority && p.id !== draggedId
      );
      
      const finalProjects = [...otherProjects, ...reorderedPriorityGroup];
      
      safeFirebaseSet('projects', finalProjects);
    }
  };

  // Show loading screen until data is loaded from Firebase
  if (!isDataLoaded) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-[#E3F2FD] to-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-[#0572CE] mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Oracle Conversation Design Board</h2>
          <p className="text-gray-600">Syncing real-time data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full min-h-screen flex transition-colors duration-300 ${
      isDarkTheme ? 'bg-gray-900' : 'bg-[#f5f5f5]'
    }`}>
      {/* Left Sidebar */}
      <div 
        className={`fixed left-0 top-0 bottom-0 shadow-lg transition-all duration-300 z-20 ${
          isDarkTheme ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'
        } ${
          isSidebarOpen ? 'w-80' : 'w-0'
        }`}
      >
        <div className={`h-full flex flex-col ${isSidebarOpen ? '' : 'hidden'}`}>
          {/* Sidebar Header */}
          <div className={`p-4 flex items-center justify-between ${
            isDarkTheme ? 'border-b border-gray-700' : 'border-b border-gray-200'
          }`}>
            <h2 className={`font-bold text-lg ${isDarkTheme ? 'text-gray-100' : 'text-gray-900'}`}>All Projects</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className={isDarkTheme ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          
          {/* Add Project Button */}
          <div className={`p-3 ${isDarkTheme ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
            <button
              onClick={() => handleAddNewCard('P0')}
              className="w-full flex items-center justify-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-[#0572CE] hover:bg-[#1F3D5C]"
            >
              <Plus className="w-4 h-4" />
              Add New Project
            </button>
          </div>

          {/* Projects List */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className={`text-xs font-semibold mb-2 px-2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
              {getSortedProjectsForSidebar().length} {selectedProjectTags.length > 0 ? 'FILTERED' : ''} PROJECTS
              {selectedProjectTags.length > 0 && (
                <span className="text-[#0572CE] ml-1">({(projects || []).length} total)</span>
              )}
            </div>
            <div className="space-y-1">
              {getSortedProjectsForSidebar().map((project, index, array) => {
                const previousProject = index > 0 ? array[index - 1] : null;
                const showDivider = previousProject && previousProject.priority !== project.priority;
                
                return (
                  <div key={project.id}>
                    {showDivider && (
                      <div className="flex items-center gap-2 py-2 px-2">
                        <div className={`flex-1 h-px ${isDarkTheme ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                        <span className={`text-xs font-bold ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>{project.priority}</span>
                        <div className={`flex-1 h-px ${isDarkTheme ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                      </div>
                    )}
                    {index === 0 && (
                      <div className="flex items-center gap-2 py-2 px-2">
                        <div className={`flex-1 h-px ${isDarkTheme ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                        <span className={`text-xs font-bold ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>{project.priority}</span>
                        <div className={`flex-1 h-px ${isDarkTheme ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                      </div>
                    )}
                    <SidebarProjectItem
                      project={project}
                      onDrop={handleSidebarProjectDrop}
                      onClick={() => scrollToProject(project.id)}
                      isHighlighted={highlightedProjectId === project.id}
                      isDarkTheme={isDarkTheme}
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
      <div className={`flex-1 min-h-screen transition-colors duration-300 ${
        isDarkTheme ? 'bg-gray-900' : 'bg-[#f5f5f5]'
      }`}>
        {/* Toolbar */}
        <div className={`fixed top-0 right-0 shadow-sm z-10 px-6 py-4 transition-colors duration-300 ${
          isDarkTheme ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'
        }`} style={{ left: isSidebarOpen ? '320px' : '0' }}>
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <h1 className={`text-2xl font-bold ${isDarkTheme ? 'text-gray-100' : 'text-gray-900'}`}>Project Board – Oracle Conversation Design Team</h1>
          <div className="flex items-center gap-4">
            {currentUser && (
              <div className={`text-sm font-medium px-3 py-1 rounded-full border ${
                isDarkTheme 
                  ? 'text-green-300 bg-green-900 border-green-700' 
                  : 'text-gray-700 bg-green-100 border-green-300'
              }`}>
                👤 {currentUser}
              </div>
            )}
            <div className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
              {(projects || []).length} projects • {(teammates || []).length} teammates
            </div>
            
            {/* Online Users Display */}
            {Object.keys(onlineUsers).length > 0 && (
              <button
                onClick={() => setShowOnlineUsersModal(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:scale-105 ${isDarkTheme ? 'bg-gray-800 border-gray-700 hover:border-green-500' : 'bg-white border-gray-300 hover:border-green-500'}`}
                title="Click to see all online users"
              >
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className={`text-xs font-semibold ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                    {Object.keys(onlineUsers).length} Online
                  </span>
                </div>
                <div className="flex items-center -space-x-2">
                  {Object.values(onlineUsers).slice(0, 5).map((user, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 ${
                        isDarkTheme ? 'border-gray-800' : 'border-white'
                      }`}
                      style={{ 
                        backgroundColor: OracleColors.primary[['blue', 'green', 'orange', 'purple', 'teal'][index % 5] as keyof typeof OracleColors.primary],
                        zIndex: 5 - index
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {Object.keys(onlineUsers).length > 5 && (
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                        isDarkTheme ? 'bg-gray-700 text-gray-300 border-gray-800' : 'bg-gray-200 text-gray-700 border-white'
                      }`}
                      style={{ zIndex: 0 }}
                    >
                      +{Object.keys(onlineUsers).length - 5}
                    </div>
                  )}
                </div>
              </button>
            )}
            
            <button
              onClick={() => setShowTeammatesManagementModal(true)}
              className="flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-[#1B5E20] hover:bg-[#0D3D12]"
            >
              <Users className="w-4 h-4" />
              Team
            </button>
            <button
              onClick={handleAddCustomRow}
              className="flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-[#147A87] hover:bg-[#0D545E]"
            >
              <Plus className="w-4 h-4" />
              Row
            </button>
            <button
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
              title={isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowHowToUse(true)}
              className="flex items-center gap-2 bg-[#424242] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2C2C2C] transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Intro
            </button>
          </div>
        </div>
      </div>

      {/* Tag Filter Bar */}
      {availableProjectTags.length > 0 && (
        <div className={`pt-20 px-6 pb-2 transition-all duration-300 ${isSidebarOpen ? 'ml-80' : 'ml-0'}`}>
          <div className={`max-w-screen-2xl mx-auto rounded-lg border-2 p-4 shadow-md transition-colors duration-300 ${
            isDarkTheme 
              ? 'bg-gray-800 border-gray-600' 
              : 'bg-white border-gray-300'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <Filter className={`w-5 h-5 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`} />
              <h3 className={`font-bold text-lg ${isDarkTheme ? 'text-gray-100' : 'text-gray-700'}`}>Filter by Project Tags</h3>
              {selectedProjectTags.length > 0 && (
                <button
                  onClick={() => setSelectedProjectTags([])}
                  className={`ml-auto text-sm underline ${
                    isDarkTheme ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {availableProjectTags.map(tag => {
                const isSelected = selectedProjectTags.includes(tag);
                const projectCount = (projects || []).filter(p => (p.projectTags || []).includes(tag)).length;
                return (
                  <button
                    key={tag}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedProjectTags(selectedProjectTags.filter(t => t !== tag));
                      } else {
                        setSelectedProjectTags([...selectedProjectTags, tag]);
                      }
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                      isSelected
                        ? 'bg-gray-600 text-white border-gray-600 shadow-md'
                        : isDarkTheme
                          ? 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {tag} <span className="ml-1 opacity-75">({projectCount})</span>
                  </button>
                );
              })}
            </div>
            {selectedProjectTags.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing projects with tags: <span className="font-semibold text-[#0572CE]">{selectedProjectTags.join(', ')}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Priority Lanes */}
      <div className={`${availableProjectTags.length > 0 ? 'pt-6' : 'pt-20'} px-6 pb-6 transition-all duration-300 ${isSidebarOpen ? 'ml-80' : 'ml-0'}`}>
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
              <div className="border-2 rounded-lg p-5" style={priorityRowStyles[priority]}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="font-bold text-xl" style={priorityLabels[priority].style}>
                      {priorityLabels[priority].label}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      isDarkTheme ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-900'
                    }`}>
                      {groupedProjects[priority]?.length || 0} {groupedProjects[priority]?.length === 1 ? 'project' : 'projects'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddNewCard(priority)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border shadow-sm ${
                      isDarkTheme 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600' 
                        : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                    }`}
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
                            onShowDeliverablesModal={setShowDeliverablesModal}
                            onShowProjectTagsModal={setShowProjectTagsModal}
                            cardRef={projectRefs.current[project.id]}
                            isHighlighted={highlightedProjectId === project.id}
                            isDarkTheme={isDarkTheme}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div className={`w-full text-center py-8 text-sm ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
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
              <div className="border-2 rounded-lg p-5" style={getCustomRowBgColor(row.name)}>
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
                        <h2 className="font-bold text-xl" style={customRowColors[row.name] || { color: '#374151' }}>
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
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      isDarkTheme ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-900'
                    }`}>
                      {groupedProjects[row.name]?.length || 0} {groupedProjects[row.name]?.length === 1 ? 'project' : 'projects'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddNewCard(row.name, true)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border shadow-sm ${
                        isDarkTheme 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600' 
                          : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                      }`}
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
                            onShowDeliverablesModal={setShowDeliverablesModal}
                            onShowProjectTagsModal={setShowProjectTagsModal}
                            cardRef={projectRefs.current[project.id]}
                            isHighlighted={highlightedProjectId === project.id}
                            isDarkTheme={isDarkTheme}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div className={`w-full text-center py-8 text-sm ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
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
                      <div className="flex-1">
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
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex-1">
                        <div className="font-medium">{teammate.name}</div>
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
                          onClick={() => handleStartEditingTeammate(teammate.id, teammate.name)}
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
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0572CE] focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTeammate();
                }}
              />
              <button
                onClick={handleAddTeammate}
                className="text-white px-4 py-2 rounded-lg transition-colors bg-[#3F8C3F] hover:bg-[#22472B]"
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
              className="w-full bg-[#0572CE] text-white px-4 py-2 rounded-lg hover:bg-[#025A9F] transition-colors"
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
                        ? 'border-[#0572CE] bg-[#E3F2FD]' 
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
              className="w-full bg-[#0572CE] text-white px-4 py-2 rounded-lg hover:bg-[#025A9F] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Project Tags Modal */}
      {showProjectTagsModal && (() => {
        const project = (projects || []).find(p => p.id === showProjectTagsModal);
        const projectTags = project?.projectTags || [];
        
        const toggleProjectTag = (tag: string) => {
          if (projectTags.includes(tag)) {
            handleUpdateProject(showProjectTagsModal, { 
              projectTags: projectTags.filter(t => t !== tag) 
            });
          } else {
            handleUpdateProject(showProjectTagsModal, { 
              projectTags: [...projectTags, tag] 
            });
          }
        };

        const addNewProjectTag = () => {
          if (newProjectTagInput.trim() && !availableProjectTags.includes(newProjectTagInput.trim())) {
            toggleProjectTag(newProjectTagInput.trim());
            setNewProjectTagInput('');
          } else if (newProjectTagInput.trim() && availableProjectTags.includes(newProjectTagInput.trim())) {
            toggleProjectTag(newProjectTagInput.trim());
            setNewProjectTagInput('');
          }
        };

        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowProjectTagsModal(null)}>
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full m-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#0572CE]" />
                  <h2 className="text-xl font-bold">Manage Project Tags</h2>
                </div>
                <button onClick={() => setShowProjectTagsModal(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Add tags to categorize and filter your projects (e.g., "Seeded Topic", "Chat component", "ROC")
              </p>

              {/* Add New Tag */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Add New Tag</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newProjectTagInput}
                    onChange={(e) => setNewProjectTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addNewProjectTag();
                      }
                    }}
                    placeholder="Enter tag name..."
                    className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#0572CE] focus:outline-none"
                  />
                  <button
                    onClick={addNewProjectTag}
                    className="bg-[#0572CE] text-white px-4 py-2 rounded-lg hover:bg-[#025A9F] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Available Tags */}
              {availableProjectTags.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Existing Tags</label>
                  <div className="space-y-2">
                    {availableProjectTags.map(tag => {
                      const isSelected = projectTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleProjectTag(tag)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                            isSelected 
                              ? 'border-[#0572CE] bg-[#E3F2FD]' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                            isSelected 
                              ? 'bg-[#0572CE] text-white' 
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {tag}
                          </div>
                          {isSelected && (
                            <Check className="w-5 h-5 text-[#0572CE] ml-auto" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Selected Tags Preview */}
              {projectTags.length > 0 && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selected Tags ({projectTags.length})</label>
                  <div className="flex flex-wrap gap-2">
                    {projectTags.map(tag => (
                      <div key={tag} className="px-2 py-1 rounded-md text-xs font-medium bg-[#E3F2FD] text-[#0572CE] border border-[#3B8FDB]">
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowProjectTagsModal(null)}
                className="w-full bg-[#0572CE] text-white px-4 py-2 rounded-lg hover:bg-[#025A9F] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        );
      })()}

      {/* Deliverables Modal */}
      {showDeliverablesModal && (() => {
        const project = (projects || []).find(p => p.id === showDeliverablesModal);
        const deliverables = project?.deliverables || [];
        
        const deliverableStatusColors = {
          todo: 'bg-[#78716C]',
          inProgress: 'bg-[#0572CE]',
          done: 'bg-[#3F8C3F]',
          blocked: 'bg-[#C74634]'
        };
        
        const deliverableStatusLabels = {
          todo: 'To Do',
          inProgress: 'In Progress',
          done: 'Done',
          blocked: 'Blocked'
        };

        const addDeliverable = () => {
          const newDeliverable: Deliverable = {
            id: Date.now().toString(),
            text: 'New Deliverable',
            status: 'todo'
          };
          handleUpdateProject(showDeliverablesModal, {
            deliverables: [...deliverables, newDeliverable]
          });
        };

        const updateDeliverable = (deliverableId: string, updates: Partial<Deliverable>) => {
          const updatedDeliverables = deliverables.map(d =>
            d.id === deliverableId ? { ...d, ...updates } : d
          );
          handleUpdateProject(showDeliverablesModal, {
            deliverables: updatedDeliverables
          });
        };

        const deleteDeliverable = (deliverableId: string) => {
          const updatedDeliverables = deliverables.filter(d => d.id !== deliverableId);
          handleUpdateProject(showDeliverablesModal, {
            deliverables: updatedDeliverables
          });
        };

        const cycleDeliverableStatus = (deliverableId: string, currentStatus: Deliverable['status']) => {
          const statuses: Deliverable['status'][] = ['todo', 'inProgress', 'done', 'blocked'];
          const currentIndex = statuses.indexOf(currentStatus);
          const nextStatus = statuses[(currentIndex + 1) % statuses.length];
          updateDeliverable(deliverableId, { status: nextStatus });
        };

        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowDeliverablesModal(null)}>
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Package className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold">Deliverables</h2>
                </div>
                <button onClick={() => setShowDeliverablesModal(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4 text-sm text-gray-600">
                <strong>{project?.projectName}</strong>
              </div>
              
              <div className="space-y-3 mb-4">
                {deliverables.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No deliverables yet. Click "Add Deliverable" to create one.
                  </div>
                ) : (
                  deliverables.map(deliverable => (
                    <div key={deliverable.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={deliverable.text}
                            onChange={(e) => updateDeliverable(deliverable.id, { text: e.target.value })}
                            className="w-full font-medium text-sm border-b border-transparent hover:border-gray-300 focus:border-[#0572CE] focus:outline-none px-1 mb-2"
                            placeholder="Deliverable name..."
                          />
                          <button
                            onClick={() => cycleDeliverableStatus(deliverable.id, deliverable.status)}
                            className={`${deliverableStatusColors[deliverable.status]} text-white px-3 py-1 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity`}
                          >
                            {deliverableStatusLabels[deliverable.status]}
                          </button>
                        </div>
                        <button
                          onClick={() => deleteDeliverable(deliverable.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={addDeliverable}
                  className="flex-1 bg-[#0572CE] text-white px-4 py-2 rounded-lg hover:bg-[#025A9F] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Deliverable
                </button>
                <button
                  onClick={() => setShowDeliverablesModal(null)}
                  className="px-6 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Online Users Modal */}
      {showOnlineUsersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowOnlineUsersModal(false)}>
          <div 
            className={`rounded-lg shadow-xl p-6 max-w-md w-full m-4 ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h2 className={`text-xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  Online Users ({Object.keys(onlineUsers).length})
                </h2>
              </div>
              <button 
                onClick={() => setShowOnlineUsersModal(false)} 
                className={`hover:text-gray-600 ${isDarkTheme ? 'text-gray-400' : 'text-gray-400'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {Object.entries(onlineUsers)
                .sort((a, b) => a[1].name.localeCompare(b[1].name))
                .map(([key, user], index) => {
                  const colorKeys = ['blue', 'green', 'orange', 'purple', 'teal', 'red', 'olive', 'navy'] as const;
                  const colorKey = colorKeys[index % colorKeys.length];
                  const timeSinceActive = Math.floor((Date.now() - user.timestamp) / 1000);
                  const isCurrentUser = user.name === currentUser;
                  
                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        isDarkTheme 
                          ? 'bg-gray-700 hover:bg-gray-650' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      } ${isCurrentUser ? 'ring-2 ring-green-500' : ''}`}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: OracleColors.primary[colorKey] }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                            {user.name}
                          </span>
                          {isCurrentUser && (
                            <span className="text-xs px-2 py-0.5 bg-green-500 text-white rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <span className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                          {timeSinceActive < 60 ? 'Active now' : `Active ${Math.floor(timeSinceActive / 60)}m ago`}
                        </span>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    </div>
                  );
                })}
            </div>
            
            <div className={`mt-4 pt-4 border-t ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-xs text-center ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                Real-time presence powered by Firebase
              </p>
            </div>
          </div>
        </div>
      )}

      {/* How to Use Modal */}
      {showHowToUse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowHowToUse(false)}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full m-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-[#0572CE]" />
                <h2 className="text-2xl font-bold">How to Use the Project Board</h2>
              </div>
              <button onClick={() => setShowHowToUse(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-5">
              <p className="text-gray-700">
                Welcome to your real-time collaborative project board! This FigJam-style board helps your team manage projects with draggable cards, priority levels, deliverables tracking, and instant Firebase synchronization.
              </p>

              <div className="bg-gradient-to-r from-[#FAFAFA] to-[#F5F5F5] border-2 border-[#BDBDBD] rounded-lg p-4">
                <h3 className="font-bold text-[#212121] mb-3 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5" />
                  Sidebar Navigation
                </h3>
                <ul className="space-y-2 text-sm text-[#424242]">
                  <li>• <strong>Quick Jump:</strong> Click on any project name in the left sidebar to instantly highlight and scroll to that card</li>
                  <li>• <strong>Drag Projects:</strong> Drag project names in the sidebar to reorder them within the same priority level</li>
                  <li>• <strong>Visual Dividers:</strong> Color-coded sections separate P0-P4 priorities and custom rows</li>
                  <li>• <strong>Toggle Sidebar:</strong> Use the chevron arrows to show/hide the sidebar for more space</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-[#E3F2FD] to-[#E8F5E9] border-2 border-[#3B8FDB] rounded-lg p-4">
                <h3 className="font-bold text-[#025A9F] mb-3 flex items-center gap-2">
                  <GripVertical className="w-5 h-5" />
                  Moving Project Cards
                </h3>
                <p className="text-sm text-[#0572CE]">
                  <strong>Drag and Drop:</strong> Click and hold any project card by the grip handle (⋮⋮) and drag it to any priority row (P0-P4) or custom category. The priority will update automatically!
                </p>
              </div>

              <div className="bg-gradient-to-r from-[#E8F5E9] to-[#F1F8E9] border-2 border-[#4CAF50] rounded-lg p-4">
                <h3 className="font-bold text-[#1B5E20] mb-3 flex items-center gap-2">
                  <Edit2 className="w-5 h-5" />
                  Editing Projects
                </h3>
                <ul className="space-y-2 text-sm text-[#2E7D32]">
                  <li>• <strong>Project Name:</strong> Click on the project title to edit it inline</li>
                  <li>• <strong>Subtasks:</strong> Check/uncheck boxes to mark completion, edit text inline, or delete with the X button</li>
                  <li>• <strong>Add Subtask:</strong> Click "+ Add subtask" at the bottom of the subtask list</li>
                  <li>• <strong>Notes & Dates:</strong> Click any field to edit directly</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-[#FFF3E0] to-[#FFF9C4] border-2 border-[#FF9800] rounded-lg p-4">
                <h3 className="font-bold text-[#E65100] mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Assigning Team Members
                </h3>
                <ul className="space-y-2 text-sm text-[#F57C00]">
                  <li>• <strong>Set Owners:</strong> Click the <Users className="w-3 h-3 inline" /> icon next to "Owner" to assign project owners (can be multiple people)</li>
                  <li>• <strong>Tag Teammates:</strong> Click the <Users className="w-3 h-3 inline" /> icon under "Tagged Teammates" to loop in collaborators</li>
                  <li>• <strong>Manage Team:</strong> Use "Manage Teammates" in the toolbar to add/edit/delete team members</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-[#F3E5F5] to-[#FCE4EC] border-2 border-[#8E24AA] rounded-lg p-4">
                <h3 className="font-bold text-[#4A148C] mb-3">🔄 Status Management</h3>
                <p className="text-sm text-[#6A1B9A] mb-2">
                  Click the status badge to cycle through:
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="bg-[#9E9E9E] text-white px-3 py-1 rounded-full">To do</span>
                  <span className="text-gray-400">→</span>
                  <span className="bg-[#F57C00] text-white px-3 py-1 rounded-full">In progress</span>
                  <span className="text-gray-400">→</span>
                  <span className="bg-[#2E7D32] text-white px-3 py-1 rounded-full">Done</span>
                  <span className="text-gray-400">→</span>
                  <span className="bg-[#6A1B9A] text-white px-3 py-1 rounded-full">On hold</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-gray-500">back to To do</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#FFEBEE] to-[#FFF3E0] border-2 border-[#E57361] rounded-lg p-4">
                <h3 className="font-bold text-[#A63C2C] mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Deliverable Dates
                </h3>
                <p className="text-sm text-[#C74634]">
                  Click on the <strong>Deliverable Date</strong> field to open a calendar picker and set project deadlines.
                </p>
              </div>

              <div className="bg-gradient-to-r from-[#E8EAF6] to-[#F3E5F5] border-2 border-[#5C6BC0] rounded-lg p-4">
                <h3 className="font-bold text-[#283593] mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Deliverables Management
                </h3>
                <ul className="space-y-2 text-sm text-[#3F51B5]">
                  <li>• <strong>View Deliverables:</strong> Click the "Deliverable" link on any project card</li>
                  <li>• <strong>Add Items:</strong> Click "Add Deliverable" to create new deliverable items</li>
                  <li>• <strong>Edit & Status:</strong> Edit deliverable names inline and click status badges to cycle through: To Do → In Progress → Done → Blocked</li>
                  <li>• <strong>Track Progress:</strong> The card shows the total count of deliverables (e.g., "Deliverable (3)")</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-[#E1F5FE] to-[#E0F2F1] border-2 border-[#0572CE] rounded-lg p-4">
                <h3 className="font-bold text-[#025A9F] mb-3 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Project Tags & Filtering
                </h3>
                <ul className="space-y-2 text-sm text-[#0572CE]">
                  <li>• <strong>Add Tags:</strong> Click the <Tag className="w-3 h-3 inline" /> icon on any project card to add category tags (e.g., "Seeded Topics", "VT", "Bias")</li>
                  <li>• <strong>Filter Projects:</strong> Use the tag filter bar above P0 to show only projects with specific tags</li>
                  <li>• <strong>Multiple Tags:</strong> Select multiple tags to see projects that have any of the selected tags</li>
                  <li>• <strong>Create Tags:</strong> Add new tags on-the-fly when managing project tags - they'll be available for all projects</li>
                  <li>• <strong>Sidebar Filtering:</strong> The left sidebar also respects tag filters, showing only filtered projects</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-[#E0F2F1] to-[#E0F7FA] border-2 border-[#4DB5C2] rounded-lg p-4">
                <h3 className="font-bold text-[#147A87] mb-3 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Adding & Organizing
                </h3>
                <ul className="space-y-2 text-sm text-[#1B9AAA]">
                  <li>• <strong>New Card:</strong> Click "Add Card" in any priority row to create a new project</li>
                  <li>• <strong>Custom Rows:</strong> Click "Add Custom Row" in the toolbar to create categories like "Backlog" or "Planning"</li>
                  <li>• <strong>Delete Card:</strong> Click the X button in the top-right corner of any card</li>
                  <li>• <strong>Edit Row Names:</strong> Click the ✏️ icon next to custom row names to rename them</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-[#F3E5F5] to-[#FCE4EC] border-2 border-[#8E24AA] rounded-lg p-5">
                <h3 className="font-bold text-[#4A148C] mb-2">
                  🔄 Real-Time Collaboration
                </h3>
                <ul className="space-y-2 text-sm text-[#6A1B9A]">
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
              className="w-full bg-[#0572CE] text-white px-4 py-2 rounded-lg hover:bg-[#025A9F] transition-colors mt-6 font-semibold"
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
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-[#0572CE]"
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
              className="w-full bg-[#0572CE] text-white px-4 py-2 rounded-lg hover:bg-[#025A9F] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
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