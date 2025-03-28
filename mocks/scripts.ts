export type OSType = 'linux' | 'windows' | 'macos' | 'cross-platform';
export type ScriptCategory = 'system-admin' | 'security' | 'networking' | 'backup' | 'monitoring' | 'maintenance' | 'performance' | 'emergency';
export type EmergencyLevel = 'critical' | 'high' | 'medium' | 'low';

export interface Script {
  id: string;
  title: string;
  description: string;
  os: OSType;
  category: ScriptCategory;
  tags: string[];
  rating: number;
  downloads: number;
  code: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  createdAt: string;
  updatedAt: string;
  isFeatured?: boolean;
  emergencyLevel?: EmergencyLevel;
}

export interface Author {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  scriptsCount: number;
  totalDownloads: number;
  averageRating: number;
}

export const authors: Author[] = [
  {
    id: 'author-1',
    name: 'System Admin',
    username: 'sys_admin',
    avatar: 'https://avatars.githubusercontent.com/u/12345678',
    bio: 'Senior System Administrator with 10+ years experience in Linux and Windows environments.',
    scriptsCount: 42,
    totalDownloads: 15243,
    averageRating: 4.8
  },
  {
    id: 'author-2',
    name: 'Network Pro',
    username: 'net_admin',
    avatar: 'https://avatars.githubusercontent.com/u/23456789',
    bio: 'Network engineering specialist focused on security and performance optimization.',
    scriptsCount: 36,
    totalDownloads: 12678,
    averageRating: 4.7
  },
  {
    id: 'author-3',
    name: 'Security Expert',
    username: 'security_pro',
    avatar: 'https://avatars.githubusercontent.com/u/34567890',
    bio: 'Cybersecurity professional specializing in intrusion detection and system hardening.',
    scriptsCount: 29,
    totalDownloads: 9456,
    averageRating: 4.9
  },
  {
    id: 'author-4',
    name: 'Docker Master',
    username: 'docker_pro',
    avatar: 'https://avatars.githubusercontent.com/u/45678901',
    bio: 'Container enthusiast, DevOps engineer, and infrastructure automation expert.',
    scriptsCount: 18,
    totalDownloads: 7834,
    averageRating: 4.6
  }
];

export const mockScripts: Script[] = [
  {
    id: 'script-1',
    title: 'Comprehensive System Health Monitor',
    description: 'This multi-platform script provides real-time monitoring of critical system metrics including CPU, memory, disk usage, running processes, and network statistics. Configurable alerts when thresholds are exceeded.',
    os: 'linux',
    category: 'monitoring',
    tags: ['monitoring', 'performance', 'alerts', 'cpu', 'memory', 'disk', 'network'],
    rating: 4.9,
    downloads: 1243,
    code: `#!/bin/bash
# Comprehensive System Health Monitor
# Version: 2.1.0

set -e

# Configuration
CPU_THRESHOLD="80"
MEM_THRESHOLD="90"
DISK_THRESHOLD="85"

check_cpu() {
  cpu_usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\\([0-9.]*\\)%* id.*/\\1/" | awk '{print 100 - $1}')
  printf "CPU Usage: %.1f%%\\n" "$cpu_usage"
  
  if [ $(echo "$cpu_usage > $CPU_THRESHOLD" | bc -l) -eq 1 ]; then
    send_alert "CPU Usage" "CPU usage is at $cpu_usage%"
  fi
}

check_memory() {
  mem_info=$(free -m | grep Mem)
  total_mem=$(echo "$mem_info" | awk '{print $2}')
  used_mem=$(echo "$mem_info" | awk '{print $3}')
  mem_usage=$(echo "scale=2; $used_mem*100/$total_mem" | bc)
  
  printf "Memory Usage: %.1f%% (%sMB / %sMB)\\n" "$mem_usage" "$used_mem" "$total_mem"
  
  if [ $(echo "$mem_usage > $MEM_THRESHOLD" | bc -l) -eq 1 ]; then
    send_alert "Memory Usage" "Memory usage is at $mem_usage%"
  fi
}

# Main function and more code would follow...`,
    authorId: 'author-1',
    authorName: 'System Admin',
    authorUsername: 'sys_admin',
    createdAt: '2023-06-01T12:34:56Z',
    updatedAt: '2023-06-10T09:45:30Z',
    isFeatured: true
  },
  {
    id: 'script-2',
    title: 'Log Rotation & Compression Utility',
    description: 'Smart log rotation script that identifies and compresses large log files based on age and size patterns, with configurable retention policies.',
    os: 'linux',
    category: 'maintenance',
    tags: ['logs', 'maintenance', 'performance', 'storage', 'automation'],
    rating: 4.8,
    downloads: 1842,
    code: `#!/bin/bash
# Log Rotation & Compression Utility
# Version: 1.3.5

# Configuration
LOG_DIR="/var/log"
MAX_AGE=30  # days
MAX_SIZE=100  # MB
COMPRESSION="gzip"  # options: gzip, bzip2, xz
RETENTION=6  # months

# Function to find large logs
find_large_logs() {
  find "$LOG_DIR" -name "*.log" -type f -size +\$MAX_SIZEM
}

# Function to find old logs
find_old_logs() {
  find "$LOG_DIR" -name "*.log" -type f -mtime +$MAX_AGE
}

# Main processing function
process_logs() {
  local log_file="$1"
  local base_name=$(basename "$log_file")
  local timestamp=$(date +"%Y%m%d-%H%M%S")
  local archive_name="\$base_name-$timestamp"
  
  echo "[INFO] Processing $log_file"
  
  case "$COMPRESSION" in
    gzip)
      gzip -c "$log_file" > "\$log_file.\$archive_name.gz"
      ;;
    bzip2)
      bzip2 -c "$log_file" > "\$log_file.\$archive_name.bz2"
      ;;
    xz)
      xz -c "$log_file" > "\$log_file.\$archive_name.xz"
      ;;
    *)
      echo "[ERROR] Unknown compression method: $COMPRESSION"
      exit 1
      ;;
  esac
  
  # Truncate original log file
  cat /dev/null > "$log_file"
  echo "[INFO] Compressed and truncated $log_file"
}

# More functionality would follow...`,
    authorId: 'author-1',
    authorName: 'System Admin',
    authorUsername: 'sys_admin',
    createdAt: '2023-05-15T08:22:33Z',
    updatedAt: '2023-06-12T14:55:12Z'
  },
  {
    id: 'script-3',
    title: 'Network Interface Monitor',
    description: 'Real-time monitoring of network interfaces with bandwidth tracking, connection statistics, and automatic detection of suspicious traffic patterns.',
    os: 'cross-platform',
    category: 'networking',
    tags: ['network', 'monitoring', 'security', 'bandwidth', 'traffic'],
    rating: 4.7,
    downloads: 1675,
    code: `#!/bin/bash
# Network Interface Monitor
# Version: 2.0.1

# Detect OS and set commands accordingly
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  NETSTAT_CMD="netstat -I"
  CONN_CMD="netstat -an | grep ESTABLISHED | wc -l"
  IS_MAC=true
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux
  NETSTAT_CMD="ifconfig"
  CONN_CMD="ss -tan | grep ESTAB | wc -l"
  IS_MAC=false
else
  echo "Unsupported OS: $OSTYPE"
  exit 1
fi

# Get list of interfaces
get_interfaces() {
  if [[ "$IS_MAC" == true ]]; then
    netstat -i | grep -v Name | awk '{print $1}' | grep -v lo
  else
    ip -o link show | awk -F': ' '{print $2}' | grep -v lo
  fi
}

# Monitor bandwidth for a specific interface
monitor_bandwidth() {
  local interface=$1
  local interval=\${2:-1}
  
  if [[ "$IS_MAC" == true ]]; then
    while true; do
      rx_bytes_1=$(netstat -I "$interface" -b | grep -v Name | awk '{print $7}')
      tx_bytes_1=$(netstat -I "$interface" -b | grep -v Name | awk '{print $10}')
      sleep "$interval"
      rx_bytes_2=$(netstat -I "$interface" -b | grep -v Name | awk '{print $7}')
      tx_bytes_2=$(netstat -I "$interface" -b | grep -v Name | awk '{print $10}')
      
      rx_delta=$(( (rx_bytes_2 - rx_bytes_1) / interval ))
      tx_delta=$(( (tx_bytes_2 - tx_bytes_1) / interval ))
      
      rx_kbps=$(echo "scale=2; $rx_delta / 1024" | bc)
      tx_kbps=$(echo "scale=2; $tx_delta / 1024" | bc)
      
      echo "Interface: $interface | RX: $rx_kbps KB/s | TX: $tx_kbps KB/s"
    done
  else
    # Linux implementation would go here
    # ...
  fi
}

# More code would follow...`,
    authorId: 'author-2',
    authorName: 'Network Pro',
    authorUsername: 'net_admin',
    createdAt: '2023-06-05T18:12:45Z',
    updatedAt: '2023-06-12T11:32:18Z'
  },
  {
    id: 'script-4',
    title: 'Docker Container Cleanup',
    description: 'Automated cleanup of unused Docker containers, images, and volumes based on age, status, and usage patterns. Includes safeguards for critical containers.',
    os: 'linux',
    category: 'maintenance',
    tags: ['docker', 'cleanup', 'devops', 'containers', 'maintenance'],
    rating: 4.7,
    downloads: 1432,
    code: `#!/bin/bash
# Docker Container Cleanup
# Version: 1.4.2

# Configuration
MIN_AGE=7  # days
PROTECTED_IMAGES="nginx|postgres|redis"
DRY_RUN=false
PRUNE_VOLUMES=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --prune-volumes)
      PRUNE_VOLUMES=true
      shift
      ;;
    --min-age=*)
      MIN_AGE="\${1#*=}"
      shift
      ;;
    --protected=*)
      PROTECTED_IMAGES="\${1#*=}"
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running or not accessible"
  exit 1
fi

# Get stopped containers older than MIN_AGE days
echo "Finding stopped containers older than $MIN_AGE days..."
CONTAINERS=$(docker ps -a --filter "status=exited" --filter "status=created" --format "{{.ID}} {{.Names}} {{.CreatedAt}}" | awk -v min_age="$MIN_AGE" '
  {
    cmd = "date -d \\"" $3 " " $4 "\\" +%s"
    cmd | getline created_time
    close(cmd)
    
    cmd = "date +%s"
    cmd | getline current_time
    close(cmd)
    
    age_days = (current_time - created_time) / 86400
    
    if (age_days > min_age) {
      print $1 " " $2
    }
  }
')

# More cleanup code would follow...`,
    authorId: 'author-4',
    authorName: 'Docker Master',
    authorUsername: 'docker_pro',
    createdAt: '2023-06-08T09:37:22Z',
    updatedAt: '2023-06-11T15:44:37Z'
  },
  {
    id: 'script-5',
    title: 'Emergency System Recovery Tool',
    description: 'Powerful recovery script for rescuing systems with boot failures, filesystem corruption, or critical service outages. Creates rescue points and performs step-by-step recovery.',
    os: 'linux',
    category: 'emergency',
    tags: ['recovery', 'emergency', 'boot', 'filesystem', 'rescue'],
    rating: 4.9,
    downloads: 876,
    code: `#!/bin/bash
# Emergency System Recovery Tool
# Version: 3.1.0
# USE WITH CAUTION - Run only in emergency situations

set -e

# Define colors for output
RED="\\033[0;31m"
GREEN="\\033[0;32m"
YELLOW="\\033[0;33m"
BLUE="\\033[0;34m"
NC="\\033[0m" # No Color

# Configuration
RESCUE_DIR="/var/rescue"
LOG_FILE="/var/log/system-recovery.log"
BACKUP_DIR="/var/backup/system"
CRITICAL_SERVICES="sshd systemd-journald systemd-logind dbus"

# Ensure running as root
if [ "$(id -u)" -ne 0 ]; then
  echo -e "COLOR_REDError: This script must be run as rootCOLOR_RESET"
  exit 1
fi

# Function to log messages
log_message() {
  local level=$1
  local message=$2
  local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
  
  echo -e "$timestamp [\\$level] \\$message" | tee -a "$LOG_FILE"
}

# Function to check boot status
check_boot() {
  log_message "INFO" "Checking boot status..."
  
  # Check if we're in emergency/rescue mode
  if systemctl is-active emergency.target > /dev/null || systemctl is-active rescue.target > /dev/null; then
    log_message "WARNING" "System is in emergency/rescue mode"
    return 1
  fi
  
  # Check for failed units
  local failed_units=$(systemctl --failed --plain --no-legend | wc -l)
  if [ "$failed_units" -gt 0 ]; then
    log_message "WARNING" "Found $failed_units failed systemd units"
    systemctl --failed --plain --no-legend | awk '{print $1}' | while read -r unit; do
      log_message "WARNING" "Failed unit: $unit"
    done
    return 1
  fi
  
  log_message "INFO" "Boot status appears normal"
  return 0
}

# More recovery functions would follow...`,
    authorId: 'author-1',
    authorName: 'System Admin',
    authorUsername: 'sys_admin',
    createdAt: '2023-04-12T04:23:16Z',
    updatedAt: '2023-06-09T17:12:53Z',
    emergencyLevel: 'critical'
  },
  {
    id: 'script-6',
    title: 'Security Breach Response Kit',
    description: 'Comprehensive security incident response toolkit for detecting and containing security breaches, gathering forensic evidence, and implementing emergency lockdown procedures.',
    os: 'linux',
    category: 'emergency',
    tags: ['security', 'emergency', 'incident-response', 'forensics', 'lockdown'],
    rating: 4.8,
    downloads: 742,
    code: `#!/bin/bash
# Security Breach Response Kit
# Version: 2.5.1
# EMERGENCY USE ONLY

# Configuration
EVIDENCE_DIR="/var/log/security/evidence"
LOCKDOWN_LEVEL="moderate" # options: minimal, moderate, strict
NOTIFY_EMAIL=""
NETWORK_ISOLATION=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --lockdown=*)
      LOCKDOWN_LEVEL="\${1#*=}"
      shift
      ;;
    --isolate-network)
      NETWORK_ISOLATION=true
      shift
      ;;
    --notify=*)
      NOTIFY_EMAIL="\${1#*=}"
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Ensure running as root
if [ "$(id -u)" -ne 0 ]; then
  echo "Error: This script must be run as root"
  exit 1
fi

# Create evidence directory with secure permissions
mkdir -p "$EVIDENCE_DIR"
chmod 700 "$EVIDENCE_DIR"

# Timestamp for evidence files
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")

# Function to collect system information
collect_system_info() {
  echo "Collecting system information..."
  
  # Basic system info
  hostname > "$EVIDENCE_DIR/hostname-$TIMESTAMP.txt"
  date > "$EVIDENCE_DIR/date-$TIMESTAMP.txt"
  uname -a > "$EVIDENCE_DIR/uname-$TIMESTAMP.txt"
  
  # User information
  last > "$EVIDENCE_DIR/last-$TIMESTAMP.txt"
  lastlog > "$EVIDENCE_DIR/lastlog-$TIMESTAMP.txt"
  who > "$EVIDENCE_DIR/who-$TIMESTAMP.txt"
  w > "$EVIDENCE_DIR/w-$TIMESTAMP.txt"
  
  # Network information
  netstat -tuanlp > "$EVIDENCE_DIR/netstat-$TIMESTAMP.txt"
  lsof -i > "$EVIDENCE_DIR/lsof-network-$TIMESTAMP.txt"
  iptables-save > "$EVIDENCE_DIR/iptables-$TIMESTAMP.txt"
  
  # Process information
  ps aux > "$EVIDENCE_DIR/ps-$TIMESTAMP.txt"
  
  # More collection would follow...
}

# More incident response functions would follow...`,
    authorId: 'author-3',
    authorName: 'Security Expert',
    authorUsername: 'security_pro',
    createdAt: '2023-05-18T14:32:47Z',
    updatedAt: '2023-06-14T08:19:36Z',
    emergencyLevel: 'high'
  },
  {
    id: 'script-7',
    title: 'Quick Network Diagnostics Tool',
    description: 'Fast network diagnostics script that identifies connectivity issues, DNS problems, routing configuration errors, and bandwidth bottlenecks.',
    os: 'cross-platform',
    category: 'emergency',
    tags: ['network', 'diagnostics', 'troubleshooting', 'connectivity', 'dns'],
    rating: 4.7,
    downloads: 1058,
    code: `#!/bin/bash
# Quick Network Diagnostics Tool
# Version: 1.8.2

# Configuration
TEST_HOSTS="1.1.1.1 8.8.8.8 9.9.9.9"
DNS_SERVERS="1.1.1.1 8.8.8.8 9.9.9.9"
TEST_DOMAINS="google.com amazon.com microsoft.com cloudflare.com"
INTERFACE=""
VERBOSE=false
TEST_BANDWIDTH=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -i|--interface)
      INTERFACE="$2"
      shift 2
      ;;
    -v|--verbose)
      VERBOSE=true
      shift
      ;;
    -b|--bandwidth)
      TEST_BANDWIDTH=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  OS="Linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
  OS="macOS"
else
  echo "Unsupported OS: $OSTYPE"
  exit 1
fi

# Print header
echo "===== Network Diagnostics Tool ====="
echo "Time: $(date)"
echo "OS: $OS"
echo

# Function to check connectivity
check_connectivity() {
  echo "=== Connectivity Tests ==="
  
  # Local network
  echo -n "Checking local network... "
  if ping -c 1 -W 1 $(ip route | grep default | awk '{print $3}') > /dev/null 2>&1; then
    echo "OK"
  else
    echo "FAILED"
    echo "  Cannot reach default gateway. Check physical connection or router."
  fi
  
  # Internet connectivity
  echo "Checking internet connectivity..."
  for host in $TEST_HOSTS; do
    echo -n "  $host: "
    if ping -c 1 -W 2 $host > /dev/null 2>&1; then
      echo "Reachable"
    else
      echo "Unreachable"
    fi
  done
  
  # More connectivity tests would follow...
}

# More diagnostic functions would follow...`,
    authorId: 'author-2',
    authorName: 'Network Pro',
    authorUsername: 'net_admin',
    createdAt: '2023-05-22T11:09:38Z',
    updatedAt: '2023-06-13T16:28:51Z',
    emergencyLevel: 'medium'
  }
];

export const categories = [
  {
    id: 'system-admin',
    name: 'System Administration',
    description: 'Manage users, services, processes, and system configurations across different operating systems.',
    icon: '🔧',
    count: 52,
    popularTags: ['Users', 'Services', 'Configuration']
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Protect systems with security audits, vulnerability scanning, intrusion detection, and hardening scripts.',
    icon: '🔒',
    count: 41,
    popularTags: ['Hardening', 'Firewall', 'Audit']
  },
  {
    id: 'networking',
    name: 'Networking',
    description: 'Configure, monitor, and troubleshoot network interfaces, services, and connectivity issues.',
    icon: '🌐',
    count: 37,
    popularTags: ['Monitoring', 'DNS', 'Troubleshooting']
  },
  {
    id: 'backup',
    name: 'Backup & Recovery',
    description: 'Protect data with automated backup, snapshot, and recovery scripts for files, databases, and configurations.',
    icon: '💾',
    count: 29,
    popularTags: ['Automation', 'Recovery', 'Database']
  }
];

export const emergencyCategories = [
  {
    id: 'system-recovery',
    name: 'System Recovery',
    description: 'Powerful scripts for data recovery, fixing boot issues, restoring critical system files, and recovering from catastrophic failures.',
    icon: '🔥',
    count: 28,
    level: 'critical'
  },
  {
    id: 'security-response',
    name: 'Security Response',
    description: 'Breach analysis, system lockdown, and malware removal tools to quickly respond to security incidents.',
    icon: '🛡️',
    count: 36,
    level: 'high'
  },
  {
    id: 'quick-diagnostics',
    name: 'Quick Diagnostics',
    description: 'Fast diagnostics for hardware issues, network problems, and performance bottlenecks. Identify root causes quickly.',
    icon: '🔍',
    count: 42,
    level: 'medium'
  },
  {
    id: 'service-restoration',
    name: 'Service Restoration',
    description: 'Scripts to quickly restore critical services, reset configurations, and get systems back online after failures.',
    icon: '🔄',
    count: 23,
    level: 'medium'
  }
];

export const quickActions = [
  {
    id: 'performance-check',
    name: 'System Performance Check',
    description: 'Run comprehensive system performance analysis to identify bottlenecks and issues',
    icon: '📊',
    count: 8
  },
  {
    id: 'cleanup',
    name: 'Cleanup & Optimization',
    description: 'Free up disk space and optimize system performance with automated maintenance scripts',
    icon: '🧹',
    count: 12
  },
  {
    id: 'security-audit',
    name: 'Security Audit',
    description: 'Check for vulnerabilities and security issues with comprehensive scanning tools',
    icon: '🔒',
    count: 10
  },
  {
    id: 'package-management',
    name: 'Package Management',
    description: 'Streamline software installation and updates across multiple systems',
    icon: '📦',
    count: 7
  }
];

export function getScriptsByCategory(category: ScriptCategory) {
  return mockScripts.filter(script => script.category === category);
}

export function getScriptsByOS(os: OSType) {
  return mockScripts.filter(script => script.os === os || script.os === 'cross-platform');
}

export function getEmergencyScripts() {
  return mockScripts.filter(script => script.emergencyLevel !== undefined);
}

export function getFeaturedScript() {
  return mockScripts.find(script => script.isFeatured);
}

export function getScriptById(id: string) {
  return mockScripts.find(script => script.id === id);
}
