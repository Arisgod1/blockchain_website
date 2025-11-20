import { defineComponent, h } from 'vue'
import {
	Github,
	FolderKanban,
	Linkedin,
	Star,
	Eye,
	Clock,
	Heart,
	Bookmark,
	Share2,
	ChevronLeft,
	ChevronRight,
	Hash,
	MessageCircle,
	Copy,
	Code,
	Coins,
	FileText,
	Wrench,
	TrendingUp,
	Layers,
	GitBranch,
	Folder,
	Filter,
	FolderX,
	CalendarCheck,
	Tag,
	ExternalLink,
	ArrowUp,
	ArrowDown,
	RotateCcw,
	Settings,
	ChevronUp,
	ChevronDown,
	Inbox,
	Download
} from 'lucide-vue-next'
import UsersIcon from './UsersIcon.vue'
import GridIcon from './GridIcon.vue'
import ListIcon from './ListIcon.vue'
import XIcon from './XIcon.vue'
import SearchIcon from './SearchIcon.vue'
import RefreshCcwIcon from './RefreshCcwIcon.vue'
import CalendarIcon from './CalendarIcon.vue'
import EmailIcon from './EmailIcon.vue'
import UniversalIcon from './UniversalIcon.vue'

const createIcon = (name: string) => defineComponent({
	name,
	inheritAttrs: false,
	setup(_, { attrs }) {
		return () => h(UniversalIcon, { ...attrs, name })
	}
})

export {
	UsersIcon,
	GridIcon,
	ListIcon,
	XIcon,
	SearchIcon,
	RefreshCcwIcon,
	CalendarIcon,
	EmailIcon
}

export {
	Github as GithubIcon,
	FolderKanban as ProjectIcon,
	Linkedin as LinkedInIcon,
	Star as StarIcon,
	Eye as EyeIcon,
	Clock as ClockIcon,
	Heart as HeartIcon,
	Bookmark as BookmarkIcon,
	Share2 as ShareIcon,
	ChevronLeft as ChevronLeftIcon,
	ChevronRight as ChevronRightIcon,
	Hash as HashIcon,
	MessageCircle as MessageCircleIcon,
	Copy as CopyIcon,
	Code as CodeIcon,
	Coins as CoinsIcon,
	FileText as FileTextIcon,
	Wrench as ToolIcon,
	TrendingUp as TrendingUpIcon,
	Layers as LayersIcon,
	GitBranch as GitBranchIcon,
	Folder as FolderIcon,
	Filter as FilterIcon,
	FolderX as FolderXIcon,
	CalendarCheck as CalendarCheckIcon,
	Tag as TagIcon,
	ExternalLink as ExternalLinkIcon,
	ArrowUp as ArrowUpIcon,
	ArrowDown as ArrowDownIcon,
	RotateCcw as RotateCcwIcon,
	Settings as SettingsIcon,
	ChevronUp as ChevronUpIcon,
	ChevronDown as ChevronDownIcon,
	Inbox as EmptyIcon,
	Download as DownloadIcon
}

export const WeiboIcon = createIcon('WeiboIcon')