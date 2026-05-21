import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ChevronRight, PanelLeftClose, PanelLeft, Sparkles, FileText, Palette, Type, Presentation, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader, Section, Card, H2, H3, Meta, Eyebrow, ImagePlaceholder, Callout, Quote, LinkChip, ControlPill, ResultsTable, PhotoGallery, ComparisonGroup } from "@/components/shared";

export const Route = createFileRoute("/")({
  component: Index,
});

type NavItem = { id: string; label: string; icon: React.ComponentType<{ className?: string }>; children?: { id: string; label: string }[] };

const nav: NavItem[] = [
  { id: "intro", label: "开场", icon: Sparkles },
  { id: "best-paper", label: "Best Paper", icon: FileText },
  {
    id: "papers",
    label: "Paper Reading",
    icon: BookOpen,
    children: [
      { id: "multicoin", label: "MultiCOIN" },
      { id: "palette", label: "Palette Diffusion" },
    ],
  },
  {
    id: "keynote",
    label: "Keynote",
    icon: Presentation,
    children: [
      { id: "ommer", label: "Björn Ommer" },
      { id: "lecuyer", label: "Anatole Lécuyer" },
    ],
  },
  { id: "textflux", label: "TextFlux (Ours)", icon: Type },
  { id: "summary", label: "总结", icon: Palette },
];

const flatIds = nav.flatMap((n) => [n.id, ...(n.children?.map((c) => c.id) ?? [])]);

function Index() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("intro");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    flatIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(h > 0 ? window.scrollY / h : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <div className="min-h-screen text-foreground">
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 z-50 h-0.5 bg-gradient-to-r from-primary via-primary/80 to-indigo-400 transition-all duration-150" style={{ width: `${scrollProgress * 100}%` }} />

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-[oklch(0.92_0.01_255)] bg-[oklch(0.97_0.008_255)] px-5 py-3.5">
        <div className="font-semibold tracking-tight text-sm">EG26 学术分享</div>
        <button onClick={() => setOpen(!open)} className="rounded-lg p-2 hover:bg-[oklch(0.94_0.01_255)] transition-colors" aria-label="Toggle navigation">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      <div className="lg:flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-x-0 top-[53px] z-30 max-h-[calc(100vh-53px)] overflow-y-auto bg-[oklch(0.97_0.008_255)] px-5 py-6 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:sticky lg:top-0 lg:flex lg:flex-col lg:h-screen lg:max-h-screen lg:flex-shrink-0 lg:border-r lg:border-[oklch(0.92_0.01_255)] lg:py-8 lg:overflow-y-auto",
            open ? "block" : "hidden lg:flex",
            collapsed ? "lg:w-[56px] lg:px-1.5" : "lg:w-[240px] lg:px-4",
          )}
        >
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "hidden lg:flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors duration-200 mb-3",
              collapsed ? "w-full h-8" : "w-7 h-7 self-end",
            )}
            aria-label={collapsed ? "展开侧边栏" : "收起侧边栏"}
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>

          {!collapsed && (
            <div className="hidden lg:block mb-6">
              <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary/80 mb-2">
                EG 2026
              </div>
              <h1 className="text-[14px] font-semibold tracking-tight leading-snug text-foreground">
                Eurographics 2026
              </h1>
              <p className="text-[12px] text-muted-foreground mt-0.5">学术分享专题</p>
            </div>
          )}

          <nav className={cn("space-y-0.5 flex-1", collapsed && "mt-1")}>
            {nav.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id || item.children?.some((c) => c.id === active);
              return (
                <div key={item.id}>
                  <button
                    onClick={() => scrollTo(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "group flex w-full items-center rounded-lg transition-all duration-200",
                      collapsed ? "justify-center px-0 py-2" : "gap-2.5 px-2.5 py-[7px] text-left text-[13px]",
                      isActive
                        ? "bg-primary/8 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-[oklch(0.94_0.01_255)]",
                    )}
                  >
                    <Icon className={cn("h-[15px] w-[15px] shrink-0", collapsed && "h-[17px] w-[17px]", isActive && "text-primary")} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && isActive && <ChevronRight className="ml-auto h-3 w-3 opacity-30" />}
                  </button>
                  {!collapsed && item.children && (
                    <div className="ml-7 mt-0.5 space-y-0.5 pl-2">
                      {item.children.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => scrollTo(c.id)}
                          className={cn(
                            "block w-full rounded-md px-2 py-1 text-left text-[12px] transition-colors duration-150",
                            active === c.id ? "text-primary font-medium" : "text-muted-foreground/60 hover:text-foreground",
                          )}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {!collapsed && (
            <div className="hidden lg:block pt-5 mt-4 text-[10px] text-muted-foreground/40 leading-relaxed">
              Eurographics 2026, Aachen
            </div>
          )}
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-5 py-10 lg:px-10 lg:py-12">
          <div className="space-y-14">
            <PageHeader />

            <Section id="intro" number="00" title="开场：现场体验">
              <Card>
                <p>
                  Eurographics 2026 在德国 Aachen 举办，整体感受相当用心。会议在 <strong>cinema theater</strong> 举办，
                  听 presentation 的视觉与声学体验都非常好，也有机会现场听几位大佬的 keynote。
                </p>
                <PhotoGallery photos={[
                  { src: "/images/intro/cinema1.jpg", caption: "Cinema Theater 现场 (1)" },
                  { src: "/images/intro/cinema2.jpg", caption: "Cinema Theater 现场 (2)" },
                  { src: "/images/intro/jiaotang3.jpg", caption: "Social Event 现场" },
                  { src: "/images/intro/jiaotang4.jpg", caption: "Social Event · 大教堂" },
                  { src: "/images/intro/school5.jpg", caption: "亚琛工业大学 · Keynote (1)" },
                  { src: "/images/intro/school6.jpg", caption: "亚琛工业大学 · Keynote (2)" },
                ]} />
              </Card>
            </Section>

            <Section id="best-paper" number="01" title="Best Paper · Wave Tracing">
              <Card>
                <Meta>cgf70322.pdf · Wave Tracing: Generalizing The Path Integral To Wave Optics</Meta>
                <H3>核心问题</H3>
                <p>
                  这篇论文不是做一个更漂亮的 renderer，而是在追问一个更基础的问题：
                  经典 ray-based path tracing 到底能模拟哪些波动光学现象？哪些不能？应该怎样扩展？
                </p>
                <H3>核心贡献</H3>
                <p>
                  把经典路径积分推广到能处理波动干涉的形式，并通过 <em>weakly-local path integral</em> 与
                  <em> elliptical cones</em> 实现了可运行的 wave tracing 系统。既能处理可见光衍射，也能用于复杂环境的长波电磁传播与绕射仿真。
                </p>
                <H3>为什么是 Best Paper</H3>
                <ul>
                  <li>基础理论型工作，说明 EG 仍重视图形学底层问题</li>
                  <li>不追生成式 AI 热点，而是扩展 light transport 表达能力</li>
                  <li>对高保真渲染、科学可视化、RF/声学/电磁仿真都有长期影响</li>
                </ul>
                <Callout>
                  和「可控性」的关系：它不是用户交互意义上的 control，而是提升了 <strong>物理可解释性与仿真可控性</strong>——
                  我们知道哪些现象能模拟、模型边界在哪、应该用什么 transport primitive。
                </Callout>
              </Card>
            </Section>

            <Section id="papers" number="02" title="Paper Reading：可控性">
              <p className="text-muted-foreground text-sm">
                从 paper list 看，可控性仍是一条重要线索。这里精选两篇做 paper reading。
              </p>
              <div id="multicoin" className="scroll-mt-24">
                <Card accent>
                  <Eyebrow>2.1</Eyebrow>
                  <H2>MultiCOIN</H2>
                  <p className="text-muted-foreground text-sm -mt-1">多模态可控的视频插帧 · M. Tanveer et al. · SFU & Adobe Research</p>

                  <H3>解决的问题</H3>
                  <p>
                    现有视频插帧在复杂运动下容易崩溃，生成模型还存在严重的「一对多」模糊性，用户难以精准控制中间帧。
                    MultiCOIN 在 DiT 架构上首次实现了结合<strong>运动轨迹、深度分层、文本提示、局部目标区域</strong>的多模态精准控制。
                  </p>
                  <ImagePlaceholder src="/images/paper_reading/1.png" caption="图 1：MultiCOIN 支持多种控制条件单独或组合使用" ratio="16/9" originalCaption="MultiCOIN takes a start and end image frame to generate an interpolative video inbetweening. It supports multi-modal controls, including depth change and layering, motion trajectories, text prompts, and target regions for movement localization, to generate smooth and plausible transitions. The controls can be used individually (top four rows) to create diverse results even with the same input pair (e.g., two depth layering results in top two rows). The controls can also be organized in a complementary way to ease the user's interactions." />

                  <H3>模型架构与创新点</H3>
                  <p>为了解决 DiT 的 3D VAE 抹除细粒度控制信号（如 1px 宽轨迹）的问题，论文提出三大创新：</p>
                  <ol>
                    <li><strong>稀疏信号 RGB 化</strong>：高斯滤波器（扩散轨迹）+ 圆盘滤波器（扩散深度），把点线膨胀为 DiT 可识别的「面」。</li>
                    <li><strong>双分支编码器</strong>：内容（图像）与运动（控制信号）双通道并行，防止特征纠缠。</li>
                    <li><strong>目标区域引导</strong>：直接截取起点帧像素块沿轨迹移动，提供强空间先验。</li>
                  </ol>
                  <ImagePlaceholder src="/images/paper_reading/2.png" caption="图 2：MultiCOIN 双分支网络架构与多模态信号处理流程" ratio="16/9" originalCaption="Overview of MultiCOIN pipeline. Given a video X, we extract multi-modal motion controls through two generators: the Sparse Motion Generator via optical flow and the Sparse Depth Generator for depth maps, producing sparse RGB points for trajectory/depth. Augmented Frame Generator computes target regions and masks for fine-grained content control. Control signals are encoded via a dual-branch embedder architecture to separately capture motion and content. In addition, a text prompt condition is processed by a text encoder to provide semantic guidance over the generated content. At inference, the model flexibly integrates these multi-modal controls for interpolation." />

                  <H3>阶段性训练策略</H3>
                  <p>采用四阶段「课程学习」防止模型直接忽略稀疏控制条件：</p>
                  <ol>
                    <li>无条件插帧（学会基础过渡）</li>
                    <li>密集信号训练（建立颜色与物理运动的语义映射）</li>
                    <li>稀疏信号训练（过渡到用户手绘点线）</li>
                    <li>引入目标区域与 mask 做最终微调</li>
                  </ol>
                  <ImagePlaceholder src="/images/paper_reading/3.png" caption="图 3：Sparse Motion and Depth Generator" ratio="4/3" originalCaption="Sparse Motion and Depth Generator. Given video X, dense optical flow and depth maps are computed. Trajectories are selected from high-motion regions along which flow/depth points are sampled and expanded with 2D filters to get sparse RGB inputs." />

                  <H3>效果与对比</H3>
                  <p>
                    相比 SOTA 模型 Framer，MultiCOIN 把控制信号统一映射到与视频相同的 Latent Space，
                    时空对齐能力大幅提升，不仅轨迹更准，还能通过深度控制实现 Z 轴的完美遮挡关系。
                  </p>
                  <ImagePlaceholder src="/images/paper_reading/4.png" caption="图 4：多模态控制的多种组合方式" ratio="16/9" originalCaption="Our results illustrate several ways multi-modal controls can be applied to frame interpolation. In the top section, we show trajectory control on its own, followed by two depth variations that place the cat either in front of or behind the pumpkin. Combining trajectory with depth produces richer motion: the balloon recedes along the z-axis while the weights with the cat are pushed outward. Prompts can also be paired with trajectories, where the trajectory sets the overall movement and the prompt refines details. In the bottom section, we highlight target region control. The temporal placement of target regions determines content editing at that point: in the first case, they are inserted in the middle with both first and last frames given, while in the second they appear at the end serving as a soft replacement for the last frame." />
                </Card>
              </div>

              <div id="palette" className="scroll-mt-24">
                <Card accent>
                  <Eyebrow>2.2</Eyebrow>
                  <H2>Palette Aligned Image Diffusion</H2>
                  <p className="text-muted-foreground text-sm -mt-1">用调色板控制图像生成</p>

                  <H3>解决的问题与研究成果</H3>
                  <p>
                    文本或边缘图条件目标明确，但「调色板」作为条件由于缺乏空间信息和语义约束，常导致 mode collapse（如严重色块化）。
                    本文提出 <strong>Palette-Adapter</strong>，无需「灰度图再上色」的后处理，直接在 U-Net 内部实现细粒度高保真色彩控制，
                    并完美保持语义一致性。
                  </p>
                  <ImagePlaceholder src="/images/paper_reading2/1.png" caption="Figure 1：模型能根据少量色块精准控制生成图像的色彩分布" ratio="16/9" originalCaption="Our method enables precise control over color distribution, generating images, from richly colored to highly quantized, that are perceptually aligned with user-specified color palettes and consistent across different styles." />

                  <H3>为什么用调色板控制是个病态问题？</H3>
                  <p>
                    直接把调色板当变长 RGB 序列输入，模型极难稳定训练——潜空间方差太大。
                    核心解法是<strong>降维打击</strong>：把调色板映射为固定大小的 3D HSV 直方图（34×12×10 = 4080 bins），
                    使模型在潜空间学到一个连续的色彩流形，大大降低样本复杂度。
                  </p>
                  <ImagePlaceholder src="/images/paper_reading2/2.png" caption="Figure 2：灰度重上色方法 vs 本文直接生成方法的对比" ratio="16/9" originalCaption="Post-hoc recoloring of a grayscale image vs. palette-guided generation: we compare Gemini 2.5's palette-based grayscale recoloring (top row) and our model's palette-aligned generation (bottom row). Our model yields superior color alignment and adapts content, specifically the dog's breed, to the palette, creating semantically coherent images. Importantly, all images share the same prompt and seed." />

                  <H3>引入标量开关与潜空间梯度惩罚</H3>
                  <ul>
                    <li><strong>熵 (Entropy) 开关</strong>：控制色彩平滑度。低熵 = 扁平插画；高熵 = 真实摄影中的平滑渐变。</li>
                    <li><strong>距离 (Distance) 开关</strong>：放宽 diffusion 生成轨迹的马尔可夫链约束，允许引入调色板之外的合理色彩。</li>
                    <li><strong>负面色彩引导 (Negative CFG)</strong>：将空向量替换为「不希望的色彩直方图」，在潜空间提供强力梯度惩罚。</li>
                  </ul>
                  <ImagePlaceholder src="/images/paper_reading2/3.png" caption="Figure 3：Palette-Adapter 网络架构与训练流程" ratio="16/9" originalCaption="Training the Palette-Adapter: During training, we randomly choose the control type (histogram, palette, or unconditioned), and compute the distance between the extracted palette/histogram and the full image histogram, as well as the full histogram's entropy. The histogram is projected and normalized into 4 tokens. The remaining features are added as a separate 5th token. All tokens are fed into the adapter's cross-attention layers. We employ a multistage training strategy: trainable layers are colored red, while frozen layers are blue. Layers participating only during the initial training phase are colored yellow." />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ImagePlaceholder src="/images/paper_reading2/4.png" caption="Figure 4：负面调色板作用对比" ratio="4/3" originalCaption="Negative Palettes: Images generated based on a color palette condition (top color bar) and a manually selected negative condition (bottom color bar). A negative palette attenuates or removes the specified color(s)." />
                    <ImagePlaceholder src="/images/paper_reading2/5.png" caption="Figure 5：熵控制效果对比" ratio="4/3" originalCaption="Entropy conditioned images: Generated with low and high levels of relative entropy, and different palettes. Note how as the relative-entropy grows in the second row, more color shades, texture, and details are added." />
                  </div>

                  <H3>工程 Trick 与定性定量分析</H3>
                  <p>
                    工程上采用 <strong>Selective Block Conditioning</strong>，精确定位对全局色彩最敏感的 U-Net 层，
                    避免把色彩特征注入「空间布局」层导致结构伪影。同时对罕见色彩数据做重采样，解决长尾问题。
                  </p>
                  <ImagePlaceholder src="/images/paper_reading2/6.png" caption="Figure 7：与其他模型的横向生成质量对比" ratio="16/9" originalCaption="Comparison of palette-based generation between our method, T2I, SW-Guidance, and FLUX IC. Our method produces high-fidelity results, adhering to both prompt and palette." />
                  <ResultsTable />
                </Card>
              </div>
            </Section>

            <Section id="keynote" number="03" title="Keynote：从 World Model 到 3D 沉浸">
              <Card>
                <p className="text-sm">相关整理稿：</p>
                <p className="text-sm">使用Qwen ASR转录，API链接：https://help.aliyun.com/zh/model-studio/qwen-asr-api-reference</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <LinkChip href="/docs/Keynote笔记.md">Keynote 笔记</LinkChip>
                  <LinkChip href="/docs/翻译原稿.md">翻译原稿（完整版）</LinkChip>
                </div>
              </Card>

              <div id="ommer" className="scroll-mt-24">
                <Card>
                  <Eyebrow>3.1</Eyebrow>
                  <H2>Björn Ommer：视觉智能需要高效 World Models</H2>
                  <p>
                    真正的视觉智能不该停留在「生成像素」，而要能<strong>理解世界状态、预测世界变化、并据此规划行动</strong>。
                  </p>
                  <H3>核心观点</H3>
                  <ul>
                    <li>CV：从像素中抽取世界表示</li>
                    <li>CG：从世界表示生成像素</li>
                    <li>生成式 AI：处在两者之间，学习世界表示的分布</li>
                    <li>World model 不能只描述看到的东西，还要推理看不到的、预测未来、支持行动与规划</li>
                    <li>视频模型生成一个未来很贵，更不用说生成所有可能未来</li>
                    <li>未来需要<strong>高效、紧凑、能表达动态与可能性</strong>的 world model</li>
                  </ul>
                  {/* <Callout>
                    和可控性的关系：只生成像素就很难真正被控制；理解状态、运动与行动后果，控制才能从 prompt 进入<strong>规划层面</strong>。
                  </Callout> */}
                </Card>
              </div>

              <div id="lecuyer" className="scroll-mt-24">
                <Card>
                  <Eyebrow>3.2</Eyebrow>
                  <H2>Anatole Lécuyer：VR 的下一步是身体化与多感官交互</H2>
                  <p>
                    VR 的未来不只是更高清的视觉显示，而是让<strong>身体、触觉、大脑状态与虚拟身份</strong>一起进入数字世界。
                  </p>
                  <H3>核心观点</H3>
                  <ul>
                    <li><strong>物理沉浸</strong>：触觉、力反馈、超声波触觉</li>
                    <li><strong>运动错觉</strong>：不一定移动整把椅子，可以在头显或头部附近施加局部力反馈</li>
                    <li><strong>认知沉浸</strong>：通过心率、皮肤电、EEG 等读取用户状态</li>
                    <li><strong>BCI</strong>：主动 BCI 很酷，但被动 BCI 更可能实用——读取状态让系统适应</li>
                    <li><strong>Avatar</strong>：虚拟化身不只是外观，会影响身份认同与行为（Proteus Effect）</li>
                  </ul>
                  {/* <Callout>
                    这里的控制是<strong>人与系统之间的闭环</strong>：XR 要控制视觉、触觉、身体感、心理状态与社交反馈。
                    未来图形学系统越来越像「人、模型、物理世界」的交互系统。
                  </Callout> */}
                </Card>
              </div>
            </Section>

            <Section id="textflux" number="04" title="TextFlux：多语言场景文本合成">
              <Card highlight>
                <Meta>Multilingual Scene Text Synthesis · Oral Presentation</Meta>

                <H3>论文要解决的问题</H3>
                <p>TextFlux 做的是 <strong>multilingual scene text synthesis</strong>：在自然图像中恢复或编辑文字，同时保持视觉真实感。</p>
                <ul>
                  <li><strong>Glyph Accuracy</strong>：文字结构正确，不写错字、不漏笔画、不变形</li>
                  <li><strong>Scene Integration</strong>：文字自然融入场景，不像贴上去</li>
                </ul>
                <p>
                  已有方法通常会加 OCR encoder、glyph feature、font/color/style control。这能提升字形准确率，但带来：模型复杂、需大量标注、多语言扩展难、文字像「贴纸」。
                </p>

                <H3>核心思路</H3>
                <Callout variant="primary">
                  DiT-based diffusion 本身已经很擅长上下文理解与视觉融合，真正困难的是让它<strong>准确知道要写什么字</strong>。
                </Callout>
                <p>因此 TextFlux 不再训练复杂 OCR encoder，而是直接给模型一个可视化 glyph template：</p>
                <ol>
                  <li>将目标文字用标准字体渲染成 glyph template</li>
                  <li>把 glyph template 与原图在空间维度拼接</li>
                  <li>让 DiT inpainting model 利用上下文推理能力，把 glyph 融合进场景</li>
                  <li>模型学习重点从「从零学会拼写」变成「把给定字形自然融入场景」</li>
                </ol>
                <p>论文贡献：</p>
                <ul>
                  <li><strong>OCR-free</strong>：不需要专门的 OCR encoder 或 OCR loss</li>
                  <li><strong>Multilingual</strong>：低资源语言也能较快适配</li>
                  <li><strong>Controllable multi-line</strong>：支持多行文字与 line-level 的位置/内容控制</li>
                </ul>

                <H3>高危场景数据合成</H3>
                <p>
                  TextFlux 的一个重要应用场景是<strong>高危场景的文本数据合成</strong>——在真实数据难以获取或标注成本极高的情况下，
                  通过精准的文字编辑能力批量生成训练数据。
                </p>
                <ImagePlaceholder src="/images/textflux/1.png" caption="高危场景文本数据合成示例" ratio="16/9" originalCaption="Synthesized text data for high-risk scenarios where real data is difficult to collect or expensive to annotate." />

                <H3>与 GPT-Image-2 对比：精准区域编辑</H3>
                <p>
                  即使是 GPT-Image-2 这样强大的商业模型，在<strong>局部文字编辑</strong>任务上也会犯错——
                  给定明确的 mask 区域，它仍然会将整行文本都编辑掉，而非仅修改指定区域。
                  TextFlux 的优势在于<strong>指定区域的精准编辑</strong>，这对自动化标注流水线的收益很大。
                </p>
                <div className="space-y-6 mt-4">
                  <ComparisonGroup
                    original="/images/textflux/gpt_vs_ours/ori1.jpg"
                    results={[
                      { src: "/images/textflux/gpt_vs_ours/gpt1.jpg", label: "GPT-Image-2 (1)" },
                      { src: "/images/textflux/gpt_vs_ours/gpt2.jpg", label: "GPT-Image-2 (2)" },
                      { src: "/images/textflux/gpt_vs_ours/mask.jpg", label: "Mask" },
                      { src: "/images/textflux/gpt_vs_ours/ours1.jpg", label: "Ours (1)" },
                      { src: "/images/textflux/gpt_vs_ours/ours2.jpg", label: "Ours (2)" },
                    ]}
                  />
                  <ComparisonGroup
                    original="/images/textflux/gpt_vs_ours/ori2.jpg"
                    results={[
                      { src: "/images/textflux/gpt_vs_ours/gpt3.jpg", label: "GPT-Image-2" },
                      { src: "/images/textflux/gpt_vs_ours/ours3.jpg", label: "Ours" },
                    ]}
                  />
                </div>
                <Callout>
                  在大模型时代，除了价格优势以外，小模型方法的核心竞争力在于<strong>指定区域的精准可控性</strong>——
                  严格遵循 mask 边界，不越界编辑，这对工业级自动化标注管线至关重要。
                </Callout>

                <H3>Session Chair 的追问</H3>
                <Quote>能不能保留字体本身，但改变字体风格，比如光照等？</Quote>
                <p>这个问题正好指向 TextFlux 的下一层可控性——能否把<strong>「字体身份」与「视觉风格」拆开控制</strong>？</p>
                <ul>
                  <li>保留字体结构与 typographic identity</li>
                  <li>改变光照、材质、颜色、阴影、纹理</li>
                  <li>或在不依赖场景自动推断的情况下，给模型一份额外的 style control</li>
                </ul>
                <Callout variant="primary">
                  这指向一个更大的方向：<strong>不只是依靠场景上下文自动融合，而是给用户多一份显式控制。</strong>
                  正好契合我们的 session：<em>Diffusion and Beyond: Controlled Image Generation and Stylization</em>。
                </Callout>
                <H3>可控性主线</H3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                  <ControlPill label="颜色" paper="Palette" />
                  <ControlPill label="运动 & 区域" paper="MultiCOIN" />
                  <ControlPill label="Glyph & Layout" paper="TextFlux" />
                  <ControlPill label="风格 & 材质" paper="Next?" />
                </div>
              </Card>
            </Section>

            <Section id="summary" number="05" title="总结与资源">
              <Card>
                <H3>论文链接</H3>
                <div className="flex flex-wrap gap-2">
                  <LinkChip href="#">Wave Tracing (Best Paper)</LinkChip>
                  <LinkChip href="#">MultiCOIN</LinkChip>
                  <LinkChip href="#">Palette Aligned Image Diffusion</LinkChip>
                  <LinkChip href="#">TextFlux</LinkChip>
                </div>
                <H3>参考资料</H3>
                <div className="flex flex-wrap gap-2">
                  <LinkChip href="/docs/Keynote笔记.md">Keynote 笔记</LinkChip>
                  <LinkChip href="/docs/翻译原稿.md">翻译原稿（完整版）</LinkChip>
                </div>
              </Card>
            </Section>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="relative overflow-hidden bg-[oklch(0.20_0.06_270)] px-6 py-16 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,oklch(0.35_0.12_270/0.3),transparent_60%)]" />
        <div className="relative max-w-[1060px] mx-auto text-center">
          <p className="text-[oklch(0.7_0.06_270)] text-[10px] font-semibold uppercase tracking-[0.2em] mb-4">
            Eurographics 2026 · Aachen, Germany
          </p>
          <h2 className="text-2xl lg:text-3xl font-bold text-[oklch(0.97_0.005_270)] tracking-tight mb-3">
            Diffusion and Beyond
          </h2>
          <p className="text-[oklch(0.75_0.04_270)] text-sm max-w-[50ch] mx-auto leading-[1.7]">
            Controlled Image Generation and Stylization: 从可控颜色、运动、文字到风格与材质，探索生成式 AI 的下一步。
          </p>
        </div>
      </footer>
    </div>
  );
}
