import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Upload, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageSquare, 
  Send,
  MoreVertical,
  X,
  FileSpreadsheet,
  Download,
  AlertCircle,
  ShoppingBag,
  Pencil,
  Trash2
} from 'lucide-react';

export default function OrdersTab({ 
  orders = [], 
  onAddOrder, 
  onImportCSV, 
  onUpdateOrderStatus,
  onEditOrder,
  onDeleteOrder
}) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [selectedOrderMessages, setSelectedOrderMessages] = useState(null);

  // New Order Form state
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newWilaya, setNewWilaya] = useState('16 - Alger');
  const [newAddress, setNewAddress] = useState('');

  // CSV Import State
  const [csvText, setCsvText] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Edit Order State
  const [editingOrder, setEditingOrder] = useState(null);
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editCustomerPhone, setEditCustomerPhone] = useState('');
  const [editProduct, setEditProduct] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editWilaya, setEditWilaya] = useState('16 - Alger');
  const [editAddress, setEditAddress] = useState('');
  const [editStatus, setEditStatus] = useState('pending');
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editFormError, setEditFormError] = useState(null);

  // Delete Order State
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);
  const [deleteFormError, setDeleteFormError] = useState(null);

  // Safe List of Orders
  const safeOrders = useMemo(() => orders || [], [orders]);

  // Status Tab Counts
  const counts = useMemo(() => {
    return {
      all: safeOrders.length,
      pending: safeOrders.filter(o => o?.status === 'pending').length,
      confirmed: safeOrders.filter(o => o?.status === 'confirmed').length,
      rejected: safeOrders.filter(o => o?.status === 'rejected').length,
      no_reply: safeOrders.filter(o => o?.status === 'no_reply').length,
    };
  }, [safeOrders]);

  // Robust Defensive Filtering
  const filteredOrders = useMemo(() => {
    return safeOrders.filter((o) => {
      if (!o) return false;
      const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
      const q = (searchQuery || '').toLowerCase();

      const customerName = (o.customer_name || '').toLowerCase();
      const customerPhone = String(o.customer_phone || '');
      const product = (o.product || '').toLowerCase();
      const wilaya = (o.wilaya || '').toLowerCase();
      const address = (o.address || '').toLowerCase();

      const matchesSearch =
        customerName.includes(q) ||
        customerPhone.includes(q) ||
        product.includes(q) ||
        wilaya.includes(q) ||
        address.includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [safeOrders, filterStatus, searchQuery]);

  // Messages list for selected order (handles missing messages array from DB gracefully)
  const messagesList = useMemo(() => {
    if (!selectedOrderMessages) return [];
    if (Array.isArray(selectedOrderMessages.messages) && selectedOrderMessages.messages.length > 0) {
      return selectedOrderMessages.messages;
    }
    return [
      {
        id: `m-${selectedOrderMessages.id}`,
        content: `Bonjour ${selectedOrderMessages.customer_name || 'Client'} 👋, merci pour votre commande de ${selectedOrderMessages.product || 'votre produit'} (${Number(selectedOrderMessages.price || 0).toLocaleString()} DA). Veuillez répondre par *1* pour CONFIRMER la livraison à ${selectedOrderMessages.wilaya || 'Algérie'} ou *2* pour ANNULER.`,
        direction: 'outgoing',
        status: 'sent',
        time: selectedOrderMessages.created_at 
          ? new Date(selectedOrderMessages.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          : 'À l\'instant'
      }
    ];
  }, [selectedOrderMessages]);

  const handleManualAddSubmit = async (e) => {
    e.preventDefault();
    if (!newCustomerName || !newCustomerPhone || !newProduct || !newPrice) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      if (onAddOrder) {
        await onAddOrder({
          id: `ord-${Date.now()}`,
          customer_name: newCustomerName.trim(),
          customer_phone: newCustomerPhone.trim(),
          product: newProduct.trim(),
          price: Number(newPrice),
          wilaya: newWilaya,
          address: newAddress.trim(),
          status: 'pending',
          created_at: new Date().toISOString()
        });
      }

      setNewCustomerName('');
      setNewCustomerPhone('');
      setNewProduct('');
      setNewPrice('');
      setNewAddress('');
      setShowAddModal(false);
    } catch (err) {
      console.error("Erreur lors de l'ajout de la commande :", err);
      setFormError("Erreur lors de l'ajout de la commande. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCSVImportSubmit = async (e) => {
    e.preventDefault();
    if (!csvText) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      const lines = csvText.trim().split('\n');
      const parsed = [];
      lines.forEach((line, idx) => {
        if (idx === 0 && line.toLowerCase().includes('nom')) return;
        const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        if (cols.length >= 4) {
          parsed.push({
            id: `ord-csv-${Date.now()}-${idx}`,
            customer_name: cols[0] || 'Client Inconnu',
            customer_phone: cols[1] || '0550 00 00 00',
            product: cols[2] || 'Produit E-Commerce',
            price: Number(cols[3]) || 5000,
            wilaya: cols[4] || '16 - Alger',
            address: cols[5] || '',
            status: 'pending',
            created_at: new Date().toISOString()
          });
        }
      });

      if (parsed.length > 0 && onImportCSV) {
        await onImportCSV(parsed);
      }
      setCsvText('');
      setShowCSVModal(false);
    } catch (err) {
      console.error("Erreur d'importation CSV :", err);
      setFormError("Erreur lors de l'importation du fichier CSV. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (order) => {
    setEditingOrder(order);
    setEditCustomerName(order.customer_name || '');
    setEditCustomerPhone(order.customer_phone || '');
    setEditProduct(order.product || '');
    setEditPrice(order.price || '');
    setEditWilaya(order.wilaya || '16 - Alger');
    setEditAddress(order.address || '');
    setEditStatus(order.status || 'pending');
    setEditFormError(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingOrder) return;

    setIsEditSubmitting(true);
    setEditFormError(null);

    try {
      if (onEditOrder) {
        await onEditOrder({
          ...editingOrder,
          customer_name: editCustomerName.trim(),
          customer_phone: editCustomerPhone.trim(),
          product: editProduct.trim(),
          price: Number(editPrice),
          wilaya: editWilaya,
          address: editAddress.trim(),
          status: editStatus
        });
      }
      setEditingOrder(null);
    } catch (err) {
      console.error("Erreur lors de la modification de la commande :", err);
      setEditFormError("Erreur lors de la modification de la commande. Veuillez réessayer.");
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleOpenDelete = (order) => {
    setDeletingOrder(order);
    setDeleteFormError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingOrder) return;

    setIsDeleteSubmitting(true);
    setDeleteFormError(null);

    try {
      if (onDeleteOrder) {
        await onDeleteOrder(deletingOrder.id);
      }
      setDeletingOrder(null);
    } catch (err) {
      console.error("Erreur lors de la suppression de la commande :", err);
      setDeleteFormError("Erreur lors de la suppression de la commande. Veuillez réessayer.");
    } finally {
      setIsDeleteSubmitting(false);
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = "Nom Client,Téléphone,Produit,Prix (DA),Wilaya,Adresse\n" +
      "Karim Benali,0550123456,Chaussures Sport Pro,14500,16 - Alger,Hydra\n" +
      "Yassine Saidi,0661987654,Montre Connectée Z4,8200,31 - Oran,Es Senia\n" +
      "Meriem Khelifi,0770456789,Robe de Soirée,22000,25 - Constantine,Bellevue\n";
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_commandes_orderconfirm.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-body">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-foreground">Gestion des Commandes COD</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Suivez, modifiez et relancez vos confirmations de commandes WhatsApp en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCSVModal(true)}
            className="px-4 py-2 bg-background border border-border/80 rounded-full text-xs font-heading font-semibold text-foreground hover:bg-secondary transition-all flex items-center gap-2 shadow-xs"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Importer CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-accent text-white rounded-full text-xs font-heading font-bold hover:bg-accent/90 transition-all flex items-center gap-2 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Ajouter une commande</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-background rounded-2xl p-4 border border-border/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 font-heading">
          {[
            { id: 'all', label: 'Toutes', count: counts.all },
            { id: 'pending', label: 'En attente', count: counts.pending },
            { id: 'confirmed', label: 'Confirmées', count: counts.confirmed },
            { id: 'rejected', label: 'Annulées', count: counts.rejected },
            { id: 'no_reply', label: 'Sans réponse', count: counts.no_reply },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                filterStatus === tab.id
                  ? 'bg-accent text-white'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filterStatus === tab.id ? 'bg-white/20 text-white' : 'bg-background text-muted-foreground'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nom, téléphone, produit..."
            className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border/70 rounded-full text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-background rounded-2xl border border-border/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-secondary/40 border-b border-border/60 font-heading font-bold text-muted-foreground uppercase text-[10px]">
                <th className="py-3.5 px-4">Client & Téléphone</th>
                <th className="py-3.5 px-4">Produit</th>
                <th className="py-3.5 px-4">Wilaya & Adresse</th>
                <th className="py-3.5 px-4">Prix (DA)</th>
                <th className="py-3.5 px-4">Statut WhatsApp</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="h-12 w-12 rounded-2xl bg-secondary text-muted-foreground flex items-center justify-center mx-auto">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                      <h4 className="font-heading font-extrabold text-sm text-foreground">
                        {safeOrders.length === 0 ? 'Aucune commande pour le moment' : 'Aucune commande ne correspond à la recherche'}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {safeOrders.length === 0 
                          ? 'Vos commandes e-commerce apparaîtront ici. Ajoutez votre première commande manuellement ou importez votre fichier CSV.'
                          : 'Essayez de modifier votre recherche ou les filtres de statut ci-dessus.'}
                      </p>
                      {safeOrders.length === 0 && (
                        <div className="flex items-center justify-center gap-3 pt-2">
                          <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2 bg-accent text-white rounded-full text-xs font-heading font-bold hover:bg-accent/90 transition-all flex items-center gap-1.5 shadow-xs"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Ajouter une commande</span>
                          </button>
                          <button
                            onClick={() => setShowCSVModal(true)}
                            className="px-4 py-2 bg-secondary text-foreground hover:bg-secondary/80 border border-border rounded-full text-xs font-heading font-bold transition-all flex items-center gap-1.5"
                          >
                            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Import CSV</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id || `ord-${Math.random()}`} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-heading font-bold text-foreground">{order.customer_name || 'Client Inconnu'}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">{order.customer_phone || '—'}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-foreground">{order.product || 'Produit'}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-foreground">{order.wilaya || '—'}</div>
                      <div className="text-[11px] text-muted-foreground truncate max-w-[160px]">{order.address || '—'}</div>
                    </td>
                    <td className="py-3.5 px-4 font-heading font-bold text-foreground">
                      {Number(order.price || 0).toLocaleString()} DA
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-heading font-bold border ${
                        order.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                        order.status === 'rejected' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                        order.status === 'no_reply' ? 'bg-slate-500/10 text-slate-600 border-slate-500/20' :
                        'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      }`}>
                        {order.status === 'confirmed' && <><CheckCircle2 className="h-3 w-3" /> Confirmé</>}
                        {order.status === 'rejected' && <><XCircle className="h-3 w-3" /> Annulé</>}
                        {order.status === 'pending' && <><Clock className="h-3 w-3" /> En attente</>}
                        {order.status === 'no_reply' && <><AlertCircle className="h-3 w-3" /> Sans réponse</>}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrderMessages(order)}
                          title="Voir l'historique WhatsApp"
                          className="px-2 py-1 rounded-lg bg-secondary text-foreground hover:bg-accent hover:text-white transition-colors text-[11px] font-heading font-bold flex items-center gap-1"
                        >
                          <MessageSquare className="h-3 w-3" />
                        </button>
                        
                        <button
                          onClick={() => handleOpenEdit(order)}
                          title="Modifier la commande"
                          className="p-1.5 rounded-lg bg-secondary text-foreground hover:bg-blue-500 hover:text-white transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenDelete(order)}
                          title="Supprimer la commande"
                          className="p-1.5 rounded-lg bg-secondary text-foreground hover:bg-rose-500 hover:text-white transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>

                        <div className="relative group">
                          <button className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </button>
                          <div className="absolute right-0 top-8 bg-background border border-border rounded-xl shadow-lg p-1 hidden group-hover:block z-30 w-40 text-left">
                            <button
                              onClick={() => onUpdateOrderStatus && onUpdateOrderStatus(order.id, 'confirmed')}
                              className="w-full text-left px-2.5 py-1.5 text-[11px] hover:bg-emerald-50 text-emerald-600 rounded-md font-heading font-semibold flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Marquer Confirmé</span>
                            </button>
                            <button
                              onClick={() => onUpdateOrderStatus && onUpdateOrderStatus(order.id, 'rejected')}
                              className="w-full text-left px-2.5 py-1.5 text-[11px] hover:bg-rose-50 text-rose-600 rounded-md font-heading font-semibold flex items-center gap-1.5"
                            >
                              <XCircle className="h-3 w-3" />
                              <span>Marquer Annulé</span>
                            </button>
                            <div className="my-1 border-t border-border/60" />
                            <button
                              onClick={() => handleOpenEdit(order)}
                              className="w-full text-left px-2.5 py-1.5 text-[11px] hover:bg-secondary text-foreground rounded-md font-heading font-semibold flex items-center gap-1.5"
                            >
                              <Pencil className="h-3 w-3" />
                              <span>Modifier</span>
                            </button>
                            <button
                              onClick={() => handleOpenDelete(order)}
                              className="w-full text-left px-2.5 py-1.5 text-[11px] hover:bg-rose-50 text-rose-600 rounded-md font-heading font-semibold flex items-center gap-1.5"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Supprimer</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Add Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-background rounded-3xl p-6 border border-border shadow-2xl font-body">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="font-heading font-extrabold text-xl text-foreground mb-1">Nouvelle Commande COD</h3>
            <p className="text-xs text-muted-foreground mb-5">
              Saisissez la commande. Le message WhatsApp de confirmation sera immédiatement déclenché.
            </p>

            {formError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 font-heading font-bold text-xs flex items-center gap-2 mb-4">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleManualAddSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-semibold mb-1">Nom du client</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Karim Benali"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-semibold mb-1">Numéro WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 0550 12 34 56"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-semibold mb-1">Produit</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Chaussures Sport Pro"
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-semibold mb-1">Prix (DA)</label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 14500"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-semibold mb-1">Wilaya</label>
                  <select
                    value={newWilaya}
                    onChange={(e) => setNewWilaya(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs font-heading font-semibold focus:ring-2 focus:ring-ring"
                  >
                    {['16 - Alger', '31 - Oran', '25 - Constantine', '09 - Blida', '19 - Sétif', '23 - Annaba', '13 - Tlemcen', '35 - Boumerdès'].map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-heading font-semibold mb-1">Adresse de livraison</label>
                  <input
                    type="text"
                    placeholder="Ex: Hydra, Rue Ahmed"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-accent text-white rounded-full text-xs font-heading font-bold hover:bg-accent/90 transition-all flex items-center justify-center gap-2 mt-4 shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Enregistrement en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Enregistrer & Envoyer WhatsApp</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-background rounded-3xl p-6 border border-border shadow-2xl font-body">
            <button
              onClick={() => setEditingOrder(null)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 text-blue-600 font-heading font-bold text-xs mb-1">
              <Pencil className="h-4 w-4" />
              <span>Modification de Commande</span>
            </div>
            <h3 className="font-heading font-extrabold text-xl text-foreground mb-1">Modifier la commande</h3>
            <p className="text-xs text-muted-foreground mb-5">
              Mettez à jour les informations du client, le produit ou le statut de la commande.
            </p>

            {editFormError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 font-heading font-bold text-xs flex items-center gap-2 mb-4">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{editFormError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-semibold mb-1">Nom du client</label>
                  <input
                    type="text"
                    required
                    value={editCustomerName}
                    onChange={(e) => setEditCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-semibold mb-1">Numéro WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={editCustomerPhone}
                    onChange={(e) => setEditCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-semibold mb-1">Produit</label>
                  <input
                    type="text"
                    required
                    value={editProduct}
                    onChange={(e) => setEditProduct(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-semibold mb-1">Prix (DA)</label>
                  <input
                    type="number"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-semibold mb-1">Wilaya</label>
                  <select
                    value={editWilaya}
                    onChange={(e) => setEditWilaya(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs font-heading font-semibold focus:ring-2 focus:ring-ring"
                  >
                    {['16 - Alger', '31 - Oran', '25 - Constantine', '09 - Blida', '19 - Sétif', '23 - Annaba', '13 - Tlemcen', '35 - Boumerdès'].map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-heading font-semibold mb-1">Statut WhatsApp</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs font-heading font-semibold focus:ring-2 focus:ring-ring"
                  >
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmé</option>
                    <option value="rejected">Annulé</option>
                    <option value="no_reply">Sans réponse</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-semibold mb-1">Adresse de livraison</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-xl text-xs focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="flex-1 py-3 bg-secondary text-foreground rounded-full text-xs font-heading font-bold hover:bg-secondary/80 transition-all border border-border"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isEditSubmitting}
                  className="flex-1 py-3 bg-accent text-white rounded-full text-xs font-heading font-bold hover:bg-accent/90 transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                >
                  {isEditSubmitting ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <span>Enregistrer les modifications</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Order Confirmation Modal */}
      {deletingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-background rounded-3xl p-6 border border-border shadow-2xl font-body space-y-4">
            <button
              onClick={() => setDeletingOrder(null)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <Trash2 className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-heading font-extrabold text-xl text-foreground">Supprimer cette commande ?</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Êtes-vous sûr de vouloir supprimer définitivement la commande de <strong className="text-foreground">{deletingOrder.customer_name}</strong> ({deletingOrder.product}) ? Cette action est irreversible.
              </p>
            </div>

            {deleteFormError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 font-heading font-bold text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{deleteFormError}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingOrder(null)}
                className="flex-1 py-2.5 bg-secondary text-foreground rounded-full text-xs font-heading font-bold hover:bg-secondary/80 transition-all border border-border"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleteSubmitting}
                className="flex-1 py-2.5 bg-rose-600 text-white rounded-full text-xs font-heading font-bold hover:bg-rose-700 transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                {isDeleteSubmitting ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Suppression...</span>
                  </>
                ) : (
                  <span>Confirmer la suppression</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showCSVModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-background rounded-3xl p-6 border border-border shadow-2xl font-body">
            <button
              onClick={() => setShowCSVModal(false)}
              className="absolute top-5 right-5 h-8 w-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 text-accent font-semibold text-xs mb-1">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Importation de Masse</span>
            </div>
            <h3 className="font-heading font-extrabold text-xl text-foreground mb-1">Importer vos commandes CSV</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Collez vos données CSV ou importez un fichier. Format recommandé: Nom, Téléphone, Produit, Prix, Wilaya, Adresse.
            </p>

            <div className="mb-4">
              <button
                type="button"
                onClick={downloadSampleCSV}
                className="text-xs text-accent font-heading font-bold flex items-center gap-1.5 hover:underline"
              >
                <Download className="h-3.5 w-3.5" /> Télécharger un exemple de fichier CSV (.csv)
              </button>
            </div>

            <form onSubmit={handleCSVImportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-semibold mb-1">Données CSV (Copier-Coller)</label>
                <textarea
                  rows={5}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder={`Nom Client,Téléphone,Produit,Prix (DA),Wilaya,Adresse\nKarim Benali,0550123456,Chaussures Sport,14500,16 - Alger,Hydra`}
                  className="w-full p-3 bg-secondary/50 border border-border rounded-xl text-xs font-mono focus:ring-2 focus:ring-ring"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-primary text-primary-foreground rounded-full text-xs font-heading font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Importation...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Importer & Lancer les relances</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Messages Drawer */}
      {selectedOrderMessages && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end font-body">
          <div className="w-full max-w-md bg-background h-full p-6 shadow-2xl border-l border-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-4">
                <div>
                  <h3 className="font-heading font-bold text-foreground text-sm">
                    {selectedOrderMessages.customer_name || 'Client'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedOrderMessages.customer_phone || '—'} • {selectedOrderMessages.wilaya || 'Algérie'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrderMessages(null)}
                  className="h-8 w-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-muted-foreground block mb-3">
                Historique des Messages WhatsApp
              </span>

              {/* Chat bubble list */}
              <div className="space-y-3">
                {messagesList.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[85%] ${
                      m.direction === 'outgoing' ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl text-xs ${
                        m.direction === 'outgoing'
                          ? 'bg-accent text-white rounded-br-none font-sans'
                          : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 rounded-bl-none font-sans'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.content}</p>
                      <span className="text-[9px] opacity-75 block text-right mt-1">{m.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border/60">
              <button
                onClick={() => {
                  if (onUpdateOrderStatus) {
                    onUpdateOrderStatus(selectedOrderMessages.id, 'confirmed');
                  }
                  setSelectedOrderMessages(null);
                }}
                className="w-full py-2.5 bg-emerald-600 text-white rounded-full text-xs font-heading font-bold hover:bg-emerald-700 transition-colors shadow-xs"
              >
                Forcer la confirmation manuellement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
