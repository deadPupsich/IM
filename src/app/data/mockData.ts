import { Incident, User } from '../types/incident';

export const mockUser: User = {
  id: 'u1',
  name: 'Иван Петров',
  email: 'ivan.petrov@company.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
  teams: ['SOC L1', 'SOC L2', 'DLP']
};

export const mockUsersDirectory: User[] = [
  mockUser,
  {
    id: 'u2',
    name: 'Алексей Смирнов',
    email: 'alexey.smirnov@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexey',
    teams: ['SOC L1', 'SOC L2']
  },
  {
    id: 'u3',
    name: 'Мария Иванова',
    email: 'maria.ivanova@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    teams: ['SOC L2', 'DLP']
  },
  {
    id: 'u4',
    name: 'Дмитрий Козлов',
    email: 'dmitry.kozlov@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry',
    teams: ['DLP']
  },
  {
    id: 'u5',
    name: 'Ольга Морозова',
    email: 'olga.morozova@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olga',
    teams: ['SOC L1']
  }
];

export const mockIncidents: Incident[] = [
  {
    id: '1',
    название: 'Подозрительная активность в сети',
    ответственный: 'Алексей Смирнов',
    источник: 'SIEM',
    хост: 'SRV-EDGE-01',
    списокФайлов: ['log_2026-03-26.txt', 'report.pdf'],
    login: 'a.smirnov',
    команда: 'SOC L1',
    статус: 'Открыт',
    дата: '2026-03-26 10:30',
    типИнцидента: 'network',
    дополнительныеПоля: {
      targetHost: 'srv-edge-01',
      trafficProfile: 'Исходящий всплеск',
    }
  },
  {
    id: '2',
    название: 'Попытка несанкционированного доступа',
    ответственный: 'Мария Иванова',
    источник: 'Firewall',
    хост: 'GW-AUTH-02',
    списокФайлов: ['access_log.txt'],
    login: 'svc.vpn',
    команда: 'SOC L2',
    статус: 'В работе',
    дата: '2026-03-26 09:15',
    типИнцидента: 'security',
    дополнительныеПоля: {
      severity: 'Высокая',
      attackVector: 'Brute Force',
    }
  },
  {
    id: '3',
    название: 'Утечка конфиденциальных данных',
    ответственный: 'Дмитрий Козлов',
    источник: 'DLP System',
    хост: 'WS-DLP-014',
    списокФайлов: ['evidence_001.zip', 'screenshot.png', 'metadata.json'],
    login: 'user.name',
    команда: 'DLP',
    статус: 'Расследование',
    дата: '2026-03-26 08:00',
    типИнцидента: 'dlp',
    дополнительныеПоля: {
      dataCategory: 'Персональные данные',
      channel: 'Email',
    }
  },
  {
    id: '4',
    название: 'Вредоносное ПО обнаружено',
    ответственный: 'Ольга Морозова',
    источник: 'Antivirus',
    хост: 'WKS-USER-042',
    списокФайлов: ['malware_sample.exe'],
    login: 'p.sidorov',
    команда: 'SOC L1',
    статус: 'Закрыт',
    дата: '2026-03-25 16:45',
    типИнцидента: 'malware',
    дополнительныеПоля: {
      malwareFamily: 'Trojan.Generic',
      quarantineStatus: 'Изолирован',
    }
  },
  {
    id: '5',
    название: 'Аномальный трафик к внешнему IP',
    ответственный: 'Сергей Волков',
    источник: 'Network Monitor',
    хост: 'FW-CORE-02',
    списокФайлов: ['traffic_dump.pcap', 'analysis.xlsx'],
    login: 'net.monitor',
    команда: 'SOC L2',
    статус: 'Открыт',
    дата: '2026-03-26 11:20',
    типИнцидента: 'network',
    дополнительныеПоля: {
      targetHost: 'fw-core-02',
      trafficProfile: 'Подключение к внешнему IP',
    }
  },
  {
    id: '6',
    название: 'Отправка файлов на личную почту',
    ответственный: 'Елена Новикова',
    источник: 'Email Gateway',
    хост: 'MAIL-GW-01',
    списокФайлов: ['email_headers.txt', 'attachment_list.csv'],
    login: 'employee',
    команда: 'DLP',
    статус: 'В работе',
    дата: '2026-03-26 07:30',
    типИнцидента: 'dlp',
    дополнительныеПоля: {
      dataCategory: 'Коммерческая тайна',
      channel: 'Личная почта',
    }
  }
];
