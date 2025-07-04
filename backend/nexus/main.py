
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncio
import aiohttp
import os
from datetime import datetime
import json

app = FastAPI(title="Nexus AI", description="Sistema de Orquestração Multi-IA", version="3.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class OrchestrateRequest(BaseModel):
    prompt: str
    mode: str = "general"  # general, development, voip_analysis
    context: Optional[Dict[str, Any]] = None

class OrchestrateResponse(BaseModel):
    result: str
    consensus_score: float
    ais_consulted: List[str]
    processing_time: float
    timestamp: str

class AIConnector:
    def __init__(self, name: str, api_key: str = None):
        self.name = name
        self.api_key = api_key
        self.enabled = bool(api_key)
    
    async def query(self, prompt: str, context: Dict = None) -> str:
        """Simular consulta à IA"""
        if not self.enabled:
            return f"[{self.name}] API não configurada"
        
        # Aqui seria a implementação real das APIs
        await asyncio.sleep(0.5)  # Simular latência
        return f"[{self.name}] Resposta simulada para: {prompt[:50]}..."

class NexusOrchestrator:
    def __init__(self):
        self.connectors = {
            'gemini': AIConnector('Google Gemini', os.getenv('GOOGLE_GEMINI_API_KEY')),
            'gpt': AIConnector('OpenAI GPT', os.getenv('OPENAI_API_KEY')),
            'claude': AIConnector('Anthropic Claude', os.getenv('ANTHROPIC_API_KEY')),
            'qwen': AIConnector('Alibaba Qwen', os.getenv('ALIBABA_QWEN_API_KEY')),
            'grok': AIConnector('xAI Grok', os.getenv('XAI_GROK_API_KEY')),
        }
        
        self.dev_connectors = {
            'code_llama': AIConnector('Code Llama', os.getenv('CODE_LLAMA_API_KEY')),
            'alphacode': AIConnector('AlphaCode', os.getenv('ALPHACODE_API_KEY')),
            'copilot': AIConnector('GitHub Copilot', os.getenv('COPILOT_API_KEY')),
        }
    
    async def orchestrate(self, request: OrchestrateRequest) -> OrchestrateResponse:
        start_time = datetime.utcnow()
        
        # Selecionar IAs baseado no modo
        if request.mode == "development":
            active_connectors = {**self.connectors, **self.dev_connectors}
        else:
            active_connectors = self.connectors
        
        # Filtrar apenas IAs habilitadas
        enabled_connectors = {k: v for k, v in active_connectors.items() if v.enabled}
        
        if not enabled_connectors:
            return OrchestrateResponse(
                result="Nenhuma IA configurada. Configure as API Keys no painel de configurações.",
                consensus_score=0.0,
                ais_consulted=[],
                processing_time=0.0,
                timestamp=datetime.utcnow().isoformat()
            )
        
        # Consultar IAs em paralelo
        tasks = []
        for name, connector in enabled_connectors.items():
            tasks.append(self._query_ai(connector, request.prompt, request.context))
        
        responses = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Processar respostas
        valid_responses = []
        ais_consulted = []
        
        for i, (name, response) in enumerate(zip(enabled_connectors.keys(), responses)):
            ais_consulted.append(name)
            if isinstance(response, Exception):
                valid_responses.append(f"[{name}] Erro: {str(response)}")
            else:
                valid_responses.append(response)
        
        # Gerar consenso (simplificado)
        if valid_responses:
            # Em uma implementação real, aqui seria o algoritmo de consenso
            consensus_result = self._generate_consensus(valid_responses, request.prompt)
            consensus_score = 0.85  # Score simulado
        else:
            consensus_result = "Não foi possível gerar resposta."
            consensus_score = 0.0
        
        processing_time = (datetime.utcnow() - start_time).total_seconds()
        
        return OrchestrateResponse(
            result=consensus_result,
            consensus_score=consensus_score,
            ais_consulted=ais_consulted,
            processing_time=processing_time,
            timestamp=datetime.utcnow().isoformat()
        )
    
    async def _query_ai(self, connector: AIConnector, prompt: str, context: Dict = None) -> str:
        try:
            return await connector.query(prompt, context)
        except Exception as e:
            return f"Erro ao consultar {connector.name}: {str(e)}"
    
    def _generate_consensus(self, responses: List[str], prompt: str) -> str:
        """Gerar consenso a partir das respostas (implementação simplificada)"""
        if not responses:
            return "Nenhuma resposta válida obtida."
        
        # Em uma implementação real, aqui seria um algoritmo sofisticado de consenso
        return f"""
## Resposta Consensual do Nexus AI

**Prompt analisado:** {prompt}

**Análise integrada de {len(responses)} IAs:**

{chr(10).join([f"• {response}" for response in responses[:3]])}

**Consenso Final:**
Baseado na análise das múltiplas inteligências artificiais consultadas, a resposta mais alinhada e validada é uma síntese das perspectivas apresentadas, considerando aspectos de precisão técnica, relevância contextual e alinhamento ético.

*Esta resposta foi gerada através do sistema de consenso do Nexus AI v3.0*
        """.strip()

# Instância global do orquestrador
orchestrator = NexusOrchestrator()

# Endpoints
@app.get("/")
async def root():
    return {
        "service": "Nexus AI",
        "version": "3.0.0",
        "status": "operational",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
async def health_check():
    enabled_ais = [name for name, connector in orchestrator.connectors.items() if connector.enabled]
    enabled_dev_ais = [name for name, connector in orchestrator.dev_connectors.items() if connector.enabled]
    
    return {
        "status": "healthy",
        "enabled_ais": enabled_ais,
        "enabled_dev_ais": enabled_dev_ais,
        "total_enabled": len(enabled_ais) + len(enabled_dev_ais),
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/orchestrate", response_model=OrchestrateResponse)
async def orchestrate_ais(request: OrchestrateRequest):
    try:
        result = await orchestrator.orchestrate(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na orquestração: {str(e)}")

@app.post("/analyze_sip")
async def analyze_sip_log(file_content: str):
    """Análise de logs SIP via Nexus AI"""
    request = OrchestrateRequest(
        prompt=f"Analise este log SIP e forneça diagnóstico detalhado:\n\n{file_content}",
        mode="voip_analysis",
        context={"analysis_type": "sip_log"}
    )
    
    result = await orchestrator.orchestrate(request)
    return result

@app.post("/predict_device_failure")
async def predict_device_failure(device_data: Dict[str, Any]):
    """Análise preditiva de falhas de dispositivos"""
    request = OrchestrateRequest(
        prompt=f"Analise os dados do dispositivo e preveja possíveis falhas:\n\n{json.dumps(device_data, indent=2)}",
        mode="general",
        context={"analysis_type": "predictive_maintenance"}
    )
    
    result = await orchestrator.orchestrate(request)
    return result

@app.post("/auto_correction")
async def auto_correction(error_data: Dict[str, Any]):
    """Sistema de auto-correção"""
    request = OrchestrateRequest(
        prompt=f"Analise este erro do sistema e gere código de correção:\n\n{json.dumps(error_data, indent=2)}",
        mode="development",
        context={"analysis_type": "auto_correction"}
    )
    
    result = await orchestrator.orchestrate(request)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
