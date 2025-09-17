import * as React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Admin() {
  const [quotes, setQuotes] = React.useState<any[]>([]);
  const [contacts, setContacts] = React.useState<any[]>([]);
  const [jobs, setJobs] = React.useState<any[]>([]);
  const [resources, setResources] = React.useState<any[]>([]);
  const [analytics, setAnalytics] = React.useState<any | null>(null);

  const [jobForm, setJobForm] = React.useState({
    title: "",
    location: "",
    employment_type: "",
    department: "",
    description: "",
    requirements: "",
  });
  const [resourceForm, setResourceForm] = React.useState({
    title: "",
    resource_type: "",
    file_url: "",
    description: "",
  });

  const [adminToken, setAdminToken] = React.useState<string | null>(null);
  const [username, setUsername] = React.useState("admin");
  const [password, setPassword] = React.useState("admin@2024");
  const [loginError, setLoginError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchList();
  }, [adminToken]);

  const fetchList = async () => {
    const headers: any = { "content-type": "application/json" };
    if (adminToken) headers.Authorization = `Bearer ${adminToken}`;

    const safeJson = async (resPromise: Promise<Response>) => {
      try {
        const res = await resPromise;
        const json = await res.json().catch(() => null);
        return json;
      } catch (e) {
        return null;
      }
    };

    const [qResRaw, cResRaw, jResRaw, rResRaw, aRaw] = await Promise.all([
      safeJson(fetch("/api/admin/quotes", { headers })),
      safeJson(fetch("/api/admin/contacts", { headers })),
      safeJson(fetch("/api/admin/jobs", { headers })),
      safeJson(fetch("/api/admin/resources", { headers })),
      safeJson(fetch("/api/admin/analytics", { headers })),
    ]);

    const normalize = (v: any) => {
      if (!v) return [];
      if (Array.isArray(v)) return v;
      if (Array.isArray(v?.data)) return v.data;
      if (Array.isArray(v?.quotes)) return v.quotes;
      if (Array.isArray(v?.items)) return v.items;
      // fallback: if object with keys, convert to array of values
      if (typeof v === "object") return Object.values(v);
      return [];
    };

    setQuotes(normalize(qResRaw));
    setContacts(normalize(cResRaw));
    setJobs(normalize(jResRaw));
    setResources(normalize(rResRaw));
    setAnalytics(aRaw || null);
  };

  const submitJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers: any = { "content-type": "application/json" };
    if (adminToken) headers.Authorization = `Bearer ${adminToken}`;
    await fetch("/api/admin/jobs", {
      method: "POST",
      headers,
      body: JSON.stringify(jobForm),
    });
    setJobForm({
      title: "",
      location: "",
      employment_type: "",
      department: "",
      description: "",
      requirements: "",
    });
    fetchList();
  };

  const [uploading, setUploading] = React.useState(false);
  const submitResource = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers: any = { "content-type": "application/json" };
    if (adminToken) headers.Authorization = `Bearer ${adminToken}`;
    await fetch("/api/admin/resources", {
      method: "POST",
      headers,
      body: JSON.stringify(resourceForm),
    });
    setResourceForm({
      title: "",
      resource_type: "",
      file_url: "",
      description: "",
    });
    fetchList();
  };

  const handleFileChange = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      // upload to server
      const bucket = "resources";
      const path = `${Date.now()}-${file.name}`;
      const headers: any = { "content-type": "application/json" };
      if (adminToken) headers.Authorization = `Bearer ${adminToken}`;
      const resp = await fetch("/api/admin/upload", {
        method: "POST",
        headers,
        body: JSON.stringify({
          bucket,
          path,
          file_base64: base64,
          contentType: file.type,
        }),
      });
      const data = await resp.json();
      if (data?.url) {
        setResourceForm((s) => ({ ...s, file_url: data.url }));
      } else {
        console.error("Upload failed", data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const download = async (key: string) => {
    try {
      const headers: any = {};
      if (adminToken) headers.Authorization = `Bearer ${adminToken}`;
      const resp = await fetch(`/api/admin/export/${key}`, { headers });
      if (!resp.ok) {
        const txt = await resp.text();
        alert("Export failed: " + txt);
        return;
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${key}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Export failed");
      console.error(err);
    }
  };

  const downloadExcel = async () => {
    try {
      const headers: any = {};
      if (adminToken) headers.Authorization = `Bearer ${adminToken}`;
      const resp = await fetch(`/api/admin/export-all/xlsx`, { headers });
      if (!resp.ok) {
        const txt = await resp.text();
        alert("Export failed: " + txt);
        return;
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `forms-export.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Export failed");
      console.error(err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const resp = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || "Login failed");
      setAdminToken(data.token);
    } catch (err: any) {
      setLoginError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          {!adminToken ? (
            <form onSubmit={handleLogin} className="mb-6 flex items-end gap-3">
              <div>
                <label className="block text-sm font-medium">Username</label>
                <Input value={username} onChange={(e: any) => setUsername(e.target.value)} placeholder="admin" />
              </div>
              <div>
                <label className="block text-sm font-medium">Password</label>
                <Input type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="admin@2024" />
              </div>
              <Button type="submit">Login</Button>
              {loginError && <span className="text-red-600 text-sm">{loginError}</span>}
            </form>
          ) : (
            <div className="mb-4 text-sm">Logged in. <Button variant="outline" onClick={() => setAdminToken(null)}>Logout</Button></div>
          )}

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/80 p-6 rounded-xl shadow">
              <h2 className="font-semibold mb-3">Submissions</h2>
              <div className="flex gap-2">
                <Button onClick={() => download("quotes")}>
                  Download Quotes
                </Button>
                <Button onClick={() => download("contacts")}>
                  Download Contacts
                </Button>
                <Button variant="outline" onClick={downloadExcel}>Download All (Excel)</Button>
              </div>
              <div className="mt-4">
                <h3 className="font-medium">Recent Quotes</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  {quotes.slice(0, 10).map((q: any, idx: number) => (
                    <li key={q.id ?? `quote-${idx}`}>
                      {q.name} — {q.category} — {q.bill_range}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="font-medium">Recent Contacts</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  {contacts.slice(0, 10).map((c: any, idx: number) => (
                    <li key={c.id ?? `contact-${idx}`}>
                      {c.name} — {c.email}
                    </li>
                  ))}
                </ul>
              </div>
              {analytics && (
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 rounded">Total Quotes: <b>{analytics.totals?.quotes}</b></div>
                  <div className="p-3 bg-gray-50 rounded">Total Contacts: <b>{analytics.totals?.contacts}</b></div>
                  <div className="p-3 bg-gray-50 rounded">Total Jobs: <b>{analytics.totals?.jobs}</b></div>
                  <div className="p-3 bg-gray-50 rounded">Total Resources: <b>{analytics.totals?.resources}</b></div>
                </div>
              )}
            </div>

            <div className="bg-white/80 p-6 rounded-xl shadow">
              <h2 className="font-semibold mb-3">Jobs & Resources</h2>
              <div className="flex gap-2 mb-4">
                <Button onClick={() => download("jobs")}>Download Jobs</Button>
                <Button onClick={() => download("resources")}>
                  Download Resources
                </Button>
              </div>

              <div>
                <h3 className="font-medium">Existing Jobs</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  {jobs.map((j: any, idx: number) => (
                    <li key={j.id ?? `job-${idx}`}>
                      {j.title} — {j.location}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <h3 className="font-medium">Resources</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  {resources.map((r: any, idx: number) => (
                    <li key={r.id ?? `resource-${idx}`}>
                      {r.title} — {r.resource_type}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <form
              onSubmit={submitJob}
              className="bg-white/80 p-6 rounded-xl shadow space-y-3"
            >
              <h3 className="font-semibold">Add Job</h3>
              <Input
                placeholder="Title"
                value={jobForm.title}
                onChange={(e: any) =>
                  setJobForm({ ...jobForm, title: e.target.value })
                }
              />
              <Input
                placeholder="Location"
                value={jobForm.location}
                onChange={(e: any) =>
                  setJobForm({ ...jobForm, location: e.target.value })
                }
              />
              <Input
                placeholder="Employment Type"
                value={jobForm.employment_type}
                onChange={(e: any) =>
                  setJobForm({ ...jobForm, employment_type: e.target.value })
                }
              />
              <Input
                placeholder="Department"
                value={jobForm.department}
                onChange={(e: any) =>
                  setJobForm({ ...jobForm, department: e.target.value })
                }
              />
              <Textarea
                placeholder="Description"
                value={jobForm.description}
                onChange={(e: any) =>
                  setJobForm({ ...jobForm, description: e.target.value })
                }
              />
              <Textarea
                placeholder="Requirements"
                value={jobForm.requirements}
                onChange={(e: any) =>
                  setJobForm({ ...jobForm, requirements: e.target.value })
                }
              />
              <Button type="submit">Create Job</Button>
            </form>

            <form
              onSubmit={submitResource}
              className="bg-white/80 p-6 rounded-xl shadow space-y-3"
            >
              <h3 className="font-semibold">Add Resource</h3>
              <Input
                placeholder="Title"
                value={resourceForm.title}
                onChange={(e: any) =>
                  setResourceForm({ ...resourceForm, title: e.target.value })
                }
              />
              <Input
                placeholder="Type (whitepaper/pdf/link)"
                value={resourceForm.resource_type}
                onChange={(e: any) =>
                  setResourceForm({
                    ...resourceForm,
                    resource_type: e.target.value,
                  })
                }
              />

              <div className="flex items-center gap-2">
                <input
                  id="resource-file"
                  type="file"
                  accept="*/*"
                  onChange={(e: any) => {
                    const f = e.target.files && e.target.files[0];
                    handleFileChange(f);
                  }}
                />
                <span className="text-sm text-muted-foreground">
                  {uploading
                    ? "Uploading..."
                    : resourceForm.file_url
                      ? "Uploaded"
                      : "No file"}
                </span>
              </div>

              <Input
                placeholder="File URL (override)"
                value={resourceForm.file_url}
                onChange={(e: any) =>
                  setResourceForm({ ...resourceForm, file_url: e.target.value })
                }
              />
              <Textarea
                placeholder="Description"
                value={resourceForm.description}
                onChange={(e: any) =>
                  setResourceForm({
                    ...resourceForm,
                    description: e.target.value,
                  })
                }
              />
              <Button type="submit" disabled={uploading}>
                Create Resource
              </Button>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
