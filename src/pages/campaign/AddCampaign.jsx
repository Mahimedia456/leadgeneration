import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import { Save, ArrowLeft } from "lucide-react";
import { createCampaignApi, getBrandsApi } from "../../lib/api";

export default function AddCampaign() {
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);

  const [form, setForm] = useState({
    name: "",
    brandId: "",
    objective: "Lead Generation",
    platform: ["Facebook", "Instagram"],
    region: "",
    budget: "",
    startDate: "",
    endDate: "",
    audience: "",
    description: "",
  });

  useEffect(() => {
    async function loadBrands() {
      try {
        const data = await getBrandsApi();
        setBrands(data || []);
      } catch (err) {
        console.error(err);
      }
    }

    loadBrands();
  }, []);

  const togglePlatform = (value) => {
    setForm((prev) => ({
      ...prev,
      platform: prev.platform.includes(value)
        ? prev.platform.filter((item) => item !== value)
        : [...prev.platform, value],
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await createCampaignApi({
        brandId: form.brandId,
        name: form.name,
        objective: form.objective,
        platform: form.platform,
        region: form.region,
        budget: Number(form.budget),
        startDate: form.startDate,
        endDate: form.endDate,
        audience: form.audience,
        description: form.description,
      });

      navigate("/campaigns");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <button onClick={() => navigate("/campaigns")}>
          <ArrowLeft /> Back
        </button>

        <h1 className="text-3xl font-black">Create Campaign</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Campaign Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="auth-minimal-input w-full px-4 py-3"
          />

          <select
            value={form.brandId}
            onChange={(e) => setForm({ ...form, brandId: e.target.value })}
            className="auth-minimal-input w-full px-4 py-3"
          >
            <option value="">Select Brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <input
            placeholder="Budget"
            type="number"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
            className="auth-minimal-input w-full px-4 py-3"
          />

          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="auth-minimal-input w-full px-4 py-3"
          />

          <input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="auth-minimal-input w-full px-4 py-3"
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="auth-minimal-input w-full px-4 py-3"
          />

          <button className="blue-gradient-btn w-full py-3 text-white">
            <Save size={16} /> Create Campaign
          </button>
        </form>
      </div>
    </AppShell>
  );
}