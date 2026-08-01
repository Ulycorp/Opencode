# Répartition des modèles — Configuration OpenCode

Ce document liste l’ensemble des agents et orchestrateurs de la configuration OpenCode ainsi que le modèle assigné à chacun.

## Règles de répartition

- **GPT-5.6 Sol** : réservé exclusivement aux orchestrateurs.
- **GPT-5.6 Terra** : utilisé pour les agents nécessitant un niveau élevé de raisonnement, d’architecture, d’analyse, de recherche ou d’implémentation complexe.
- **GPT-5.6 Luna** : utilisé pour les agents davantage procéduraux, structurés, répétitifs ou fortement assistés par des outils déterministes.

---

# 1. Orchestrateurs

| Agent | Modèle |
|---|---|
| `global-orchestrator` | **GPT-5.6 Sol** |
| `it-orchestrator` | **GPT-5.6 Sol** |
| `business-orchestrator` | **GPT-5.6 Sol** |
| `web-orchestrator` | **GPT-5.6 Sol** |
| `mobile-orchestrator` | **GPT-5.6 Sol** |
| `shopify-orchestrator` | **GPT-5.6 Sol** |
| `market-orchestrator` | **GPT-5.6 Sol** |
| `marketing-orchestrator` | **GPT-5.6 Sol** |

---

# 2. Agents App Web

| Agent | Modèle |
|---|---|
| `web-architect` | **GPT-5.6 Terra** |
| `web-frontend` | **GPT-5.6 Terra** |
| `web-backend` | **GPT-5.6 Terra** |
| `web-data` | **GPT-5.6 Terra** |
| `web-security` | **GPT-5.6 Terra** |
| `web-qa` | **GPT-5.6 Luna** |
| `web-performance-a11y` | **GPT-5.6 Luna** |
| `web-devops-release` | **GPT-5.6 Terra** |

---

# 3. Agents App Mobile

| Agent | Modèle |
|---|---|
| `mobile-architect` | **GPT-5.6 Terra** |
| `mobile-ui` | **GPT-5.6 Terra** |
| `mobile-native-ios` | **GPT-5.6 Terra** |
| `mobile-native-android` | **GPT-5.6 Terra** |
| `mobile-data-sync` | **GPT-5.6 Terra** |
| `mobile-security` | **GPT-5.6 Terra** |
| `mobile-qa` | **GPT-5.6 Luna** |
| `mobile-release` | **GPT-5.6 Luna** |

---

# 4. Agents Shopify

| Agent | Modèle |
|---|---|
| `shopify-architect` | **GPT-5.6 Terra** |
| `shopify-reference-analyzer` | **GPT-5.6 Terra** |
| `shopify-theme` | **GPT-5.6 Terra** |
| `shopify-data-catalog` | **GPT-5.6 Luna** |
| `shopify-app-extension` | **GPT-5.6 Terra** |
| `shopify-qa` | **GPT-5.6 Luna** |
| `shopify-security` | **GPT-5.6 Terra** |
| `shopify-release` | **GPT-5.6 Luna** |

---

# 5. Agents Analyse de Marché

| Agent | Modèle |
|---|---|
| `seo-geo-researcher` | **GPT-5.6 Terra** |
| `ecommerce-intelligence` | **GPT-5.6 Terra** |
| `advertising-intelligence` | **GPT-5.6 Terra** |
| `opportunity-researcher` | **GPT-5.6 Terra** |

---

# 6. Agents Marketing

| Agent | Modèle |
|---|---|
| `persona-strategist` | **GPT-5.6 Terra** |
| `creative-producer` | **GPT-5.6 Terra** |

---

# 7. Agent Juridique

| Agent | Modèle |
|---|---|
| `legal-auditor` | **GPT-5.6 Terra** |

---

# 8. Synthèse

## GPT-5.6 Sol

8 rôles :

- `global-orchestrator`
- `it-orchestrator`
- `business-orchestrator`
- `web-orchestrator`
- `mobile-orchestrator`
- `shopify-orchestrator`
- `market-orchestrator`
- `marketing-orchestrator`

## GPT-5.6 Terra

24 rôles :

- `web-architect`
- `web-frontend`
- `web-backend`
- `web-data`
- `web-security`
- `web-devops-release`
- `mobile-architect`
- `mobile-ui`
- `mobile-native-ios`
- `mobile-native-android`
- `mobile-data-sync`
- `mobile-security`
- `shopify-architect`
- `shopify-reference-analyzer`
- `shopify-theme`
- `shopify-app-extension`
- `shopify-security`
- `seo-geo-researcher`
- `ecommerce-intelligence`
- `advertising-intelligence`
- `opportunity-researcher`
- `persona-strategist`
- `creative-producer`
- `legal-auditor`

## GPT-5.6 Luna

7 rôles :

- `web-qa`
- `web-performance-a11y`
- `mobile-qa`
- `mobile-release`
- `shopify-data-catalog`
- `shopify-qa`
- `shopify-release`

---

# 9. Répartition globale

| Modèle | Nombre de rôles | Part approximative |
|---|---:|---:|
| **GPT-5.6 Sol** | 8 | 21 % |
| **GPT-5.6 Terra** | 24 | 62 % |
| **GPT-5.6 Luna** | 7 | 18 % |
| **Total** | **39** | **100 %** |
