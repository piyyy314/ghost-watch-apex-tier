/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ModuleId } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { FooterBar } from './components/FooterBar';
import { SanitizeModal } from './components/SanitizeModal';

// Module views
import { DnsInterceptor } from './components/modules/DnsInterceptor';
import { RfSpectrumAnalyzer } from './components/modules/RfSpectrumAnalyzer';
import { DsssSimulator } from './components/modules/DsssSimulator';
import { PacketSmith } from './components/modules/PacketSmith';
import { LogScrubber } from './components/modules/LogScrubber';
import { IdsEvaluator } from './components/modules/IdsEvaluator';
import { NetworkProber } from './components/modules/NetworkProber';
import { Base58Core } from './components/modules/Base58Core';
import { FileExtractor } from './components/modules/FileExtractor';
import { ArrayFormatter } from './components/modules/ArrayFormatter';
import { SatComTelemetry } from './components/modules/SatComTelemetry';
import { CryptoVault } from './components/modules/CryptoVault';

import { Menu, X, Shield, Activity, Wifi } from 'lucide-react';
import { soundFx } from './utils/audio';

const MODULE_TITLES: Record<ModuleId, string> = {
  dns: 'SIGINT DNS Interceptor',
  rf_spectrum: 'RF Spectrum Analyzer',
  dsss: 'DSSS LPI Spreader',
  packet_smith: 'IPv4 & ICMP Smith',
  port_prober: 'WebSocket Port Prober',
  log_scrubber: 'Active Log Scrubber',
  ids_heuristics: 'Heuristic IDS Evaluator',
  satcom_telemetry: 'SatCom Link & Telemetry',
  base58: 'Base58 Processing Core',
  file_extractor: 'Local File Magic Bytes',
  array_formatter: 'Custom Array Formatter',
  crypto_vault: 'Quantum Crypto Vault',
};

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('dns');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSanitizeOpen, setIsSanitizeOpen] = useState(false);
  const [sessionNonce, setSessionNonce] = useState(1);

  const handleSelectModule = (id: ModuleId) => {
    setActiveModule(id);
    setIsMobileMenuOpen(false);
  };

  const handleWipeConfirmation = () => {
    // Clear state & force reload of components
    setSessionNonce(prev => prev + 1);
    setActiveModule('dns');
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dns':
        return <DnsInterceptor key={`dns-${sessionNonce}`} />;
      case 'rf_spectrum':
        return <RfSpectrumAnalyzer key={`rf-${sessionNonce}`} />;
      case 'dsss':
        return <DsssSimulator key={`dsss-${sessionNonce}`} />;
      case 'packet_smith':
        return <PacketSmith key={`packet-${sessionNonce}`} />;
      case 'log_scrubber':
        return <LogScrubber key={`scrub-${sessionNonce}`} />;
      case 'ids_heuristics':
        return <IdsEvaluator key={`ids-${sessionNonce}`} />;
      case 'port_prober':
        return <NetworkProber key={`probe-${sessionNonce}`} />;
      case 'base58':
        return <Base58Core key={`b58-${sessionNonce}`} />;
      case 'file_extractor':
        return <FileExtractor key={`file-${sessionNonce}`} />;
      case 'array_formatter':
        return <ArrayFormatter key={`array-${sessionNonce}`} />;
      case 'satcom_telemetry':
        return <SatComTelemetry key={`satcom-${sessionNonce}`} />;
      case 'crypto_vault':
        return <CryptoVault key={`crypto-${sessionNonce}`} />;
      default:
        return <DnsInterceptor />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#050608] text-[#f1f5f9] overflow-hidden select-none relative font-sans">
      {/* Visual CRT Scanline overlay */}
      <div className="scan-line" />

      {/* Top Header */}
      <Header
        activeModuleTitle={MODULE_TITLES[activeModule]}
        onEmergencyWipe={() => setIsSanitizeOpen(true)}
      />

      {/* Mobile Top Strip */}
      <div className="lg:hidden h-10 bg-[#0f1117] border-b border-[#1e293b] flex items-center justify-between px-4 z-20">
        <button
          onClick={() => {
            soundFx.playClick();
            setIsMobileMenuOpen(!isMobileMenuOpen);
          }}
          className="flex items-center gap-2 text-xs font-mono text-sky-400 font-bold"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>MODULES // [{MODULE_TITLES[activeModule]}]</span>
        </button>
        <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
          ONLINE
        </span>
      </div>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex shrink-0">
          <Sidebar activeModule={activeModule} onSelectModule={handleSelectModule} />
        </div>

        {/* Mobile Slideout Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute inset-0 z-30 bg-[#0A0C10] flex flex-col p-4 overflow-y-auto">
            <Sidebar activeModule={activeModule} onSelectModule={handleSelectModule} />
          </div>
        )}

        {/* Central Tactical Work Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#050608] flex flex-col gap-4 relative">
          {/* Quick Context Strip */}
          <div className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-[#0f1117]/80 border border-[#1e293b] text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-3">
              <span className="text-sky-400 font-bold">MODULE_ACTIVE:</span>
              <span className="text-slate-200">{MODULE_TITLES[activeModule]}</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-slate-500">
              <span>LATENCY: 12ms</span>
              <span>•</span>
              <span>ENCLAVE: SECURE_SGX</span>
              <span>•</span>
              <span className="text-emerald-400">CRYPTO_OK</span>
            </div>
          </div>

          {/* Module Inner Body */}
          <div className="flex-1">
            {renderActiveModule()}
          </div>
        </main>
      </div>

      {/* Bottom Status Rail */}
      <FooterBar />

      {/* Emergency Wipe Modal */}
      <SanitizeModal
        isOpen={isSanitizeOpen}
        onClose={() => setIsSanitizeOpen(false)}
        onConfirmWipe={handleWipeConfirmation}
      />
    </div>
  );
}
