import { Incident, User } from '../types/incident.ts';

export const mockUser: User = {
  id: 'u1',
  name: 'Иван Петров',
  email: 'ivan.petrov@company.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan'
};

export const mockUsersDirectory: User[] = [
  mockUser,
  {
    id: 'u2',
    name: 'Алексей Смирнов',
    email: 'alexey.smirnov@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexey'
  },
  {
    id: 'u3',
    name: 'Мария Иванова',
    email: 'maria.ivanova@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria'
  },
  {
    id: 'u4',
    name: 'Дмитрий Козлов',
    email: 'dmitry.kozlov@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry'
  },
  {
    id: 'u5',
    name: 'Ольга Морозова',
    email: 'olga.morozova@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olga'
  },
  {
    id: 'u6',
    name: 'Сергей Волков',
    email: 'sergey.volkov@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sergey'
  },
  {
    id: 'u7',
    name: 'Елена Новикова',
    email: 'elena.novikova@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena'
  },
  {
    id: 'u8',
    name: 'Иван Петров',
    email: 'ivan.petrov@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=IvanP'
  },
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
      priority: 'Высокий',
      detected_at: '2026-03-26 10:25',
      description: 'Обнаружен аномальный исходящий трафик на внешний IP-адрес. Требуется расследование.',
      response_time: '15',
      needs_escalation: 'true',
      affected_systems: 'SRV-EDGE-01,FW-CORE-02',
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
      priority: 'Средний',
      detected_at: '2026-03-26 09:10',
      description: 'Серия неудачных попыток входа в VPN. IP заблокирован автоматически.',
      response_time: '5',
      needs_escalation: 'false',
      affected_systems: 'VPN Gateway',
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
      priority: 'Критический',
      detected_at: '2026-03-26 07:45',
      description: 'Попытка отправки конфиденциальных документов на личную почту. Файлы заблокированы.',
      response_time: '30',
      needs_escalation: 'true',
      affected_systems: 'Exchange,File Server',
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
      priority: 'Высокий',
      detected_at: '2026-03-25 16:40',
      description: 'Обнаружен троян GenericKD. Файл удалён, система проверена.',
      response_time: '10',
      needs_escalation: 'false',
      affected_systems: 'WKS-USER-042',
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
      priority: 'Средний',
      detected_at: '2026-03-26 11:15',
      description: 'Зафиксирован всплеск трафика на подозрительный внешний IP. Требуется анализ.',
      response_time: '20',
      needs_escalation: 'false',
      affected_systems: 'FW-CORE-02',
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
      priority: 'Высокий',
      detected_at: '2026-03-26 07:25',
      description: 'Сотрудник пытался отправить коммерческие документы на внешний email.',
      response_time: '25',
      needs_escalation: 'true',
      affected_systems: 'Exchange',
    }
  },
  {
    id: '7',
    название: 'Подозрительная активность учетной записи',
    ответственный: 'Иван Петров',
    источник: 'UEBA',
    хост: 'DC-PRIMARY',
    списокФайлов: ['ad_logs.evtx'],
    login: 'admin.backup',
    команда: 'SOC L1',
    статус: 'Открыт',
    дата: '2026-03-26 14:00',
    типИнцидента: 'security',
    дополнительныеПоля: {
      priority: 'Средний',
      detected_at: '2026-03-26 13:55',
      description: 'Аномальное время входа, необычные ресурсы. Требуется проверка.',
      response_time: '15',
      needs_escalation: 'false',
      affected_systems: 'Active Directory',
    }
  },
  {
    id: '8',
    название: 'Обнаружен шифровальщик',
    ответственный: 'Алексей Смирнов',
    источник: 'EDR',
    хост: 'WKS-USER-089',
    списокФайлов: ['ransomware.exe', 'decrypt_instructions.txt'],
    login: 'k.fedorov',
    команда: 'SOC L2',
    статус: 'Расследование',
    дата: '2026-03-26 12:30',
    типИнцидента: 'malware',
    дополнительныеПоля: {
      priority: 'Критический',
      detected_at: '2026-03-26 12:25',
      description: 'Обнаружена активность шифровальщика. Процесс остановлен, файлы восстановлены из бэкапа.',
      response_time: '5',
      needs_escalation: 'true',
      affected_systems: 'WKS-USER-089,File Server',
    }
  },
  {
    id: '9',
    название: 'Массовая рассылка фишинга',
    ответственный: 'Мария Иванова',
    источник: 'Email Security',
    хост: 'MAIL-SEC-01',
    списокФайлов: ['phishing_sample.eml', 'url_list.txt'],
    login: 'external',
    команда: 'SOC L1',
    статус: 'Закрыт',
    дата: '2026-03-25 09:00',
    типИнцидента: 'security',
    дополнительныеПоля: {
      priority: 'Высокий',
      detected_at: '2026-03-25 08:55',
      description: 'Заблокирована массовая рассылка фишинговых писем. Пользователи уведомлены.',
      response_time: '10',
      needs_escalation: 'false',
      affected_systems: 'Exchange,Web Server',
    }
  },
  {
    id: '10',
    название: 'Копирование на съёмный носитель',
    ответственный: 'Дмитрий Козлов',
    источник: 'Device Control',
    хост: 'WKS-HR-003',
    списокФайлов: ['device_log.txt', 'file_manifest.csv'],
    login: 'hr.manager',
    команда: 'DLP',
    статус: 'Открыт',
    дата: '2026-03-26 15:45',
    типИнцидента: 'dlp',
    дополнительныеПоля: {
      priority: 'Высокий',
      detected_at: '2026-03-26 15:40',
      description: 'Массовое копирование документов HR на USB-накопитель.',
      response_time: '20',
      needs_escalation: 'true',
      affected_systems: 'File Server',
    }
  },
  {
    id: '11',
    название: 'DDoS атака на веб-сервис',
    ответственный: 'Сергей Волков',
    источник: 'WAF',
    хост: 'WEB-FRONT-01',
    списокФайлов: ['waf_logs.txt', 'attack_pattern.json'],
    login: 'web.service',
    команда: 'SOC L2',
    статус: 'В работе',
    дата: '2026-03-26 13:00',
    типИнцидента: 'network',
    дополнительныеПоля: {
      priority: 'Критический',
      detected_at: '2026-03-26 12:55',
      description: 'HTTP Flood атака на веб-сервис. Трафик перенаправлен через scrubbing центр.',
      response_time: '5',
      needs_escalation: 'true',
      affected_systems: 'Web Server,VPN',
    }
  },
  {
    id: '12',
    название: 'Криптомайнер на сервере',
    ответственный: 'Ольга Морозова',
    источник: 'Resource Monitor',
    хост: 'SRV-DEV-05',
    списокФайлов: ['process_dump.txt', 'network_connections.log'],
    login: 'dev.user',
    команда: 'SOC L1',
    статус: 'Открыт',
    дата: '2026-03-26 16:20',
    типИнцидента: 'malware',
    дополнительныеПоля: {
      priority: 'Средний',
      detected_at: '2026-03-26 16:15',
      description: 'Обнаружен процесс майнинга. Высокая загрузка CPU, подозрительные сетевые подключения.',
      response_time: '15',
      needs_escalation: 'false',
      affected_systems: 'SRV-DEV-05',
    }
  },
];
