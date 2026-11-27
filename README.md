# Parent_Bridge

A Secure Parent–School Communication Platform (Flutter Mobile App + React Web Dashboard + Supabase).

## User Accounts (Supabase Auth + `public.profiles`)

> **Note on Passwords:** Supabase Auth stores passwords as one-way bcrypt hashes in `auth.users`, so existing plaintext passwords cannot be retrieved from the database. Use the password you set when creating each account, or reset it via Supabase Dashboard (`Authentication -> Users`) / password reset email.

### Admin
| Name | Email | Role | Status |
| :--- | :--- | :--- | :--- |
| Admin User | `admin@school.edu` | `admin` | Active |

### Teachers
| Name | Email | Role | Status |
| :--- | :--- | :--- | :--- |
| Sara Ahmed | `sara@school.edu` | `teacher` | Active |
| Imran Khan | `imran@school.edu` | `teacher` | Active |

### Parents
| Name | Email | Role | Status |
| :--- | :--- | :--- | :--- |
| Nadia Raza | `nadia@mail.com` | `parent` | Active |
| Bilal Shah | `bilal@mail.com` | `parent` | Active |
| Hina Malik | `hina@mail.com` | `parent` | Inactive |

## Student Link Codes (`public.students`)

| Roll No | Student Name | Class | Link Code |
| :--- | :--- | :--- | :--- |
| `01` | Ali Khan | `8-A` | `K7P2M9QX` |
| `02` | Ayesha Noor | `8-A` | `R4T8W2LD` |
| `03` | Bilal Ahmed | `8-A` | `H9C3Z6NV` |
| `04` | Fatima Raza | `8-A` | `M2X7B5QA` |
| `05` | Hamza Iqbal | `8-A` | `T6J1P8EK` |
| `06` | Hira Malik | `8-A` | `D3S9Y4UG` |
| `01` | Zara Tariq | `9-A` | `Z9A1K4PM` |
| `02` | Omar Farooq | `9-B` | `O9B2M7QW` |
